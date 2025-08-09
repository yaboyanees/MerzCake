// border_componentz.js

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
                const clickedLayer = legendLayers[d];
                const isTurningOn = !map.hasLayer(clickedLayer);

                if (isTurningOn) {
                    map.addLayer(clickedLayer);
                    d3.select(event.currentTarget).classed("inactive", false);

                    if (d === 'Clusters' && map.hasLayer(legendLayers['Incidents'])) {
                        map.removeLayer(legendLayers['Incidents']);
                        legendItems.filter(name => name === 'Incidents').classed('inactive', true);
                    }
                    else if (d === 'Incidents' && map.hasLayer(legendLayers['Clusters'])) {
                        map.removeLayer(legendLayers['Clusters']);
                        legendItems.filter(name => name === 'Clusters').classed('inactive', true);
                    }
                } else {
                    map.removeLayer(clickedLayer);
                    d3.select(event.currentTarget).classed("inactive", true);
                }

                if (d === 'Incidents' || d === 'Clusters') {
                    updateMapForTime(slider.property("value"));
                }
            });

        legendItems.append("div").attr("class", "w-4 h-4 mr-2 flex items-center justify-center")
            .html(d => {
                if (d === "AOR") return `<div class="w-full h-px border-t border-dashed border-white"></div>`;
                if (d === "Incidents") return `<span class="material-symbols-outlined" style="color: #ef4444; font-size: 16px;">explosion</span>`;
                if (d === "Clusters") return `<span class="material-symbols-outlined" style="color: #f97316; font-size: 16px;">bubble_chart</span>`;
                if (d === "Outposts") return `<span class="material-symbols-outlined outpost-icon" style="color: #84CC16; font-size: 16px;">change_history</span>`;
                if (d === "Density") return `<span class="material-symbols-outlined" style="color: #e53e3e; font-size: 16px;">grid_on</span>`;
                return '';
            });

        legendItems.append("span").text(d => d).attr("class", "text-xs");
        
        // Set initial state for inactive layers
        legendItems.filter(d => !map.hasLayer(legendLayers[d])).classed('inactive', true);
    },

    /**
     * Sets up pointer and a robust, zoom-proof box-select tool.
     * @param {object} map - The Leaflet map instance.
     * @param {Array<object>} layersToSelect - An array of Leaflet layers to perform selection against.
     * @param {function} onSelectionChange - A callback function that is called with the new Set of selected IDs.
     */
    setupSelectionTools(map, layersToSelect, onSelectionChange) {
        const pointerButton = d3.select("#select-pointer-btn");
        const boxSelectButton = d3.select("#select-box-btn");
        const clearButton = d3.select("#clear-selection-btn");
        
        let isBoxSelectActive = false;
        let selectionRectangle = null;
        let startLatLng = null;
        let selectedItems = new Set();

        const updateSelection = () => {
            layersToSelect.forEach(lg => {
                if (lg && typeof lg.eachLayer === 'function') {
                    lg.eachLayer(l => {
                        if (l.getElement()) {
                            l.getElement().classList.toggle('selected', selectedItems.has(l.options.unique_id));
                        }
                    });
                }
            });
            onSelectionChange(selectedItems);
        };

        layersToSelect.forEach(layerGroup => {
            if (layerGroup && typeof layerGroup.on === 'function') {
                layerGroup.on('click', (e) => {
                    if (isBoxSelectActive) return;
                    const unique_id = e.layer.options.unique_id;
                    if (!e.originalEvent.shiftKey) { selectedItems.clear(); }
                    if (selectedItems.has(unique_id)) { selectedItems.delete(unique_id); } 
                    else { selectedItems.add(unique_id); }
                    updateSelection();
                });
            }
        });
        
        clearButton.on("click", () => {
            selectedItems.clear();
            updateSelection();
        });

        const onMouseDown = (e) => {
            startLatLng = map.mouseEventToLatLng(e.originalEvent);
            selectionRectangle = L.rectangle(L.latLngBounds(startLatLng, startLatLng), {
                color: "#60A5FA",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.2,
                dashArray: '5, 5'
            }).addTo(map);
            map.on('mousemove', onMouseMove).on('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!selectionRectangle) return;
            const currentLatLng = map.mouseEventToLatLng(e.originalEvent);
            selectionRectangle.setBounds(L.latLngBounds(startLatLng, currentLatLng));
        };

        const onMouseUp = (e) => {
            const bounds = selectionRectangle.getBounds();
            selectedItems.clear();
            layersToSelect.forEach(layerGroup => {
                if (layerGroup && typeof layerGroup.eachLayer === 'function') {
                    layerGroup.eachLayer(layer => {
                        if (bounds.contains(layer.getLatLng())) {
                            selectedItems.add(layer.options.unique_id);
                        }
                    });
                }
            });
            updateSelection();
            map.removeLayer(selectionRectangle);
            selectionRectangle = null;
            map.off('mousemove', onMouseMove).off('mouseup', onMouseUp);
            activatePointerTool();
        };

        function activatePointerTool() {
            isBoxSelectActive = false;
            d3.select("#map").style("cursor", "grab");
            if (map.dragging) map.dragging.enable();
            boxSelectButton.classed('active', false);
            pointerButton.classed('active', true);
            map.off('mousedown', onMouseDown);
        }

        function activateBoxSelectTool() {
            isBoxSelectActive = true;
            d3.select("#map").style("cursor", "crosshair");
            if (map.dragging) map.dragging.disable();
            pointerButton.classed('active', false);
            boxSelectButton.classed('active', true);
            map.on('mousedown', onMouseDown);
        }

        pointerButton.on("click", activatePointerTool);
        boxSelectButton.on("click", activateBoxSelectTool);
        activatePointerTool();
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

        if (minTime && maxTime) { slider.attr("min", minTime.getTime()).attr("max", maxTime.getTime()).attr("value", maxTime.getTime()); }

        const stopAnimation = () => { if (animationTimer) { animationTimer.stop(); animationTimer = null; playButton.text("PLAY"); } };
        
        slider.on("input", (event) => { stopAnimation(); updateMapForTime(event.target.value); });
        playButton.on("click", () => {
            if (animationTimer) { stopAnimation(); } 
            else {
                playButton.text("PAUSE");
                let currentTime = parseInt(slider.property("value"));
                if (currentTime >= maxTime.getTime()) { currentTime = minTime.getTime(); }
                animationTimer = d3.interval(() => {
                    const totalTime = maxTime.getTime() - minTime.getTime();
                    if (totalTime <= 0) { stopAnimation(); return; }
                    currentTime += totalTime / 200;
                    if (currentTime >= maxTime.getTime()) { currentTime = maxTime.getTime(); stopAnimation(); }
                    updateMapForTime(currentTime);
                }, 100);
            }
        });
        resetButton.on("click", () => { stopAnimation(); if(minTime) updateMapForTime(minTime.getTime()); });
    },

    /**
     * Creates and manages a hexbin density layer.
     * @param {object} map - The Leaflet map instance.
     * @param {object} incidentData - The GeoJSON data for incidents.
     * @returns {object} The Leaflet layer for the hexbins.
     */
    setupHexbinLayer(map, incidentData) {
        const svg = d3.select(map.getPanes().overlayPane).append("svg");
        const g = svg.append("g").attr("class", "leaflet-zoom-hide");

        const colorScale = d3.scaleQuantize()
            .domain([1, 15])
            .range(["#fee0d2", "#fc9272", "#ef3b2c", "#a50f15"]);

        const hexbin = d3.hexbin();

        function project(d) {
            const point = map.latLngToLayerPoint(new L.LatLng(d[1], d[0]));
            return [point.x, point.y];
        }

        function update() {
            const bounds = map.getBounds();
            const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
            const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
            const mapSize = map.getSize();

            svg.attr("width", mapSize.x)
               .attr("height", mapSize.y)
               .style("left", topLeft.x + "px")
               .style("top", topLeft.y + "px");
            
            g.attr("transform", `translate(${-topLeft.x}, ${-topLeft.y})`);

            hexbin.radius(50 * Math.pow(2, map.getZoom() - 8))
                  .extent([[topLeft.x, topLeft.y], [bottomRight.x, bottomRight.y]]);

            const points = incidentData.features
                .filter(d => bounds.contains(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])))
                .map(d => project(d.geometry.coordinates));

            const hexbins = hexbin(points);
            
            const path = g.selectAll("path").data(hexbins, d => `${d.i}-${d.j}`);
            path.exit().remove();
            path.enter().append("path")
                .merge(path)
                .attr("d", hexbin.hexagon())
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("fill", d => d.length > 0 ? colorScale(d.length) : "none")
                .attr("fill-opacity", 0.7)
                .attr("stroke", "#000")
                .attr("stroke-width", 0.5);

            const text = g.selectAll("text").data(hexbins, d => `${d.i}-${d.j}`);
            text.exit().remove();
            text.enter().append("text")
                .merge(text)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("dy", ".35em")
                .text(d => d.length > 0 ? d.length : '')
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("pointer-events", "none");
        }

        const hexbinLayer = L.layerGroup();
        hexbinLayer.on('add', () => {
            map.on('zoomend viewreset moveend', update);
            update();
        });
        hexbinLayer.on('remove', () => {
            map.off('zoomend viewreset moveend', update);
            g.selectAll("path").remove();
            g.selectAll("text").remove();
        });
        
        return hexbinLayer;
    }
};
