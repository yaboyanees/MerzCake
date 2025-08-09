// border_components.js

const MapComponents = {
    /**
     * Sets up the interactive legend to toggle map layers.
     * @param {object} map - The Leaflet map instance.
     * @param {object} legendLayers - An object mapping layer names to Leaflet layer objects.
     * @param {function} updateMapForTime - Callback to update time-sensitive layers.
     * @param {object} slider - The D3 selection for the time slider input.
     */
    setupLayerToggle(map, legendLayers, updateMapForTime, slider) {
        const legendContainer = d3.select("#legend-items");
        const legendItems = legendContainer.selectAll("div").data(Object.keys(legendLayers)).join("div")
            .attr("class", "legend-item flex items-center").on("click", (event, d) => {
                const layer = legendLayers[d];
                const isActive = map.hasLayer(layer);
                d3.select(event.currentTarget).classed("inactive", isActive);
                
                if (isActive) {
                    map.removeLayer(layer);
                } else {
                    map.addLayer(layer);
                    // If turning incidents back ON, re-filter them based on the current slider time
                    if (d === 'Incidents') {
                        updateMapForTime(slider.property("value"));
                    }
                }
            });

        legendItems.append("div").attr("class", "w-4 h-4 mr-2 flex items-center justify-center")
            .html(d => {
                if (d === "AOR") return `<div class="w-full h-px border-t border-dashed border-white"></div>`;
                if (d === "Incidents") return `<span class="material-symbols-outlined" style="color: #ef4444; font-size: 16px;">explosion</span>`;
                if (d === "Outposts") return `<span class="material-symbols-outlined outpost-icon" style="color: #84CC16; font-size: 16px;">change_history</span>`;
                return '';
            });

        legendItems.append("span").text(d => d).attr("class", "text-xs");
    },

    /**
     * Sets up pointer and box-select tools.
     * @param {object} map - The Leaflet map instance.
     * @param {Array<object>} layersToSelect - An array of Leaflet layers to perform selection against.
     * @param {function} onSelectionChange - A callback function that is called with the new Set of selected IDs.
     */
    setupSelectionTools(map, layersToSelect, onSelectionChange) {
        const pointerButton = d3.select("#select-pointer-btn");
        const boxSelectButton = d3.select("#select-box-btn");
        const clearButton = d3.select("#clear-selection-btn");
        
        let isBoxSelectActive = false;
        let selectionBox = null;
        let startPos = null;
        let selectedItems = new Set();

        const updateSelection = () => {
            layersToSelect.forEach(lg => lg.eachLayer(l => l.getElement()?.classList.toggle('selected', selectedItems.has(l.options.unique_id))));
            onSelectionChange(selectedItems);
        };

        layersToSelect.forEach(layerGroup => {
            layerGroup.on('click', (e) => {
                if (isBoxSelectActive) return;
                const unique_id = e.layer.options.unique_id;
                if (!e.originalEvent.shiftKey) {
                    selectedItems.clear();
                }
                if (selectedItems.has(unique_id)) {
                    selectedItems.delete(unique_id);
                } else {
                    selectedItems.add(unique_id);
                }
                updateSelection();
            });
        });
        
        clearButton.on("click", () => {
            selectedItems.clear();
            updateSelection();
        });

        const onMouseDown = (e) => { startPos = e.containerPoint; selectionBox = L.DomUtil.create('div', 'leaflet-selection-box', map.getPane('overlayPane')); L.DomUtil.setPosition(selectionBox, startPos); map.on('mousemove', onMouseMove).on('mouseup', onMouseUp); };
        const onMouseMove = (e) => { const currentPos = e.containerPoint; const bounds = L.bounds(startPos, currentPos); L.DomUtil.setPosition(selectionBox, bounds.min); selectionBox.style.width = bounds.getSize().x + 'px'; selectionBox.style.height = bounds.getSize().y + 'px'; };
        const onMouseUp = (e) => {
            const bounds = L.latLngBounds(map.containerPointToLatLng(startPos), map.containerPointToLatLng(e.containerPoint));
            selectedItems.clear();
            layersToSelect.forEach(layerGroup => {
                layerGroup.eachLayer(layer => { if (bounds.contains(layer.getLatLng())) selectedItems.add(layer.options.unique_id); });
            });
            updateSelection();
            L.DomUtil.remove(selectionBox);
            activatePointerTool();
        };

        function activatePointerTool() {
            isBoxSelectActive = false;
            d3.select("#map").style("cursor", "grab");
            map.dragging.enable();
            boxSelectButton.classed('active', false);
            pointerButton.classed('active', true);
            map.off('mousedown', onMouseDown).off('mousemove', onMouseMove).off('mouseup', onMouseUp);
        }

        function activateBoxSelectTool() {
            isBoxSelectActive = true;
            d3.select("#map").style("cursor", "crosshair");
            map.dragging.disable();
            pointerButton.classed('active', false);
            boxSelectButton.classed('active', true);
            map.on('mousedown', onMouseDown);
        }

        pointerButton.on("click", activatePointerTool);
        boxSelectButton.on("click", activateBoxSelectTool);
        activatePointerTool(); // Activate by default
    },

    /**
     * Sets up the search input to filter the data table.
     * @param {Array<object>} combinedData - The full array of data points.
     * @param {function} renderTable - Callback to re-render the table with filtered data.
     * @param {function} updateKPIs - Callback to update KPIs with filtered data.
     */
    setupTableFilter(combinedData, renderTable, updateKPIs) {
        const searchInput = d3.select("#search-filter");
        searchInput.on("input", (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const filteredData = searchTerm ? combinedData.filter(d => Object.values(d).some(val => String(val).toLowerCase().includes(searchTerm))) : combinedData;
            renderTable(filteredData);
            updateKPIs(filteredData);
        });
    },

    /**
     * Sets up the timeline slider and playback controls.
     * @param {object} timeRange - An object with minTime and maxTime Date objects.
     * @param {function} updateMapForTime - Callback to update the map based on the current time.
     */
    setupTimelineControls(timeRange, updateMapForTime) {
        const slider = d3.select("#time-slider");
        const playButton = d3.select("#play-pause-btn");
        const resetButton = d3.select("#reset-btn");
        let animationTimer = null;

        const { minTime, maxTime } = timeRange;

        if (minTime && maxTime) {
            slider.attr("min", minTime.getTime())
                  .attr("max", maxTime.getTime())
                  .attr("value", maxTime.getTime());
        }

        const stopAnimation = () => {
            if (animationTimer) {
                animationTimer.stop();
                animationTimer = null;
                playButton.text("PLAY");
            }
        };
        
        slider.on("input", (event) => {
            stopAnimation();
            updateMapForTime(event.target.value);
        });

        playButton.on("click", () => {
            if (animationTimer) {
                stopAnimation();
            } else {
                playButton.text("PAUSE");
                let currentTime = parseInt(slider.property("value"));
                if (currentTime >= maxTime.getTime()) {
                    currentTime = minTime.getTime();
                }

                animationTimer = d3.interval(() => {
                    const totalTime = maxTime.getTime() - minTime.getTime();
                    if (totalTime <= 0) { stopAnimation(); return; }
                    currentTime += totalTime / 200; // ~20 second playback
                    
                    if (currentTime >= maxTime.getTime()) {
                        currentTime = maxTime.getTime();
                        stopAnimation();
                    }
                    updateMapForTime(currentTime);
                }, 100);
            }
        });

        resetButton.on("click", () => {
            stopAnimation();
            if(minTime) updateMapForTime(minTime.getTime());
        });
    }
};
