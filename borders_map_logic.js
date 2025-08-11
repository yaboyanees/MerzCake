document.addEventListener('DOMContentLoaded', () => {
        
    /**
     * Fetches data from a URL with a specified number of retries.
     * @param {string} url - The URL to fetch data from.
     * @param {number} retries - The number of times to retry on failure.
     * @param {number} delay - The delay in milliseconds between retries.
     * @returns {Promise<any>} A promise that resolves with the fetched data.
     */
    async function fetchDataWithRetries(url, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                const data = await d3.json(url);
                return data; // Success
            } catch (error) {
                console.warn(`Attempt ${i + 1} failed for ${url}. Retrying in ${delay}ms...`);
                if (i < retries - 1) {
                    await new Promise(res => setTimeout(res, delay));
                } else {
                    console.error(`Failed to fetch ${url} after ${retries} attempts.`);
                    throw error; // Rethrow the error after the last attempt
                }
            }
        }
    }

    const MapComponents = {
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
            
            legendItems.filter(d => !map.hasLayer(legendLayers[d])).classed('inactive', true);
        },
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
        setupTableFilter(combinedData, renderTable, updateKPIs) {
            const searchInput = d3.select("#search-filter");
            searchInput.on("input", (event) => {
                const searchTerm = event.target.value.toLowerCase();
                const filteredData = searchTerm ? combinedData.filter(d => Object.values(d).some(val => String(val).toLowerCase().includes(searchTerm))) : combinedData;
                renderTable(filteredData);
                updateKPIs(filteredData);
            });
        },
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

    async function initializeApp() {
        try {
            // 1. DATA LOADING with retries
            const [aorData, incidentData, outpostData] = await Promise.all([
                fetchDataWithRetries("https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/aor.geojson"),
                fetchDataWithRetries("https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/incidents_data.geojson"),
                fetchDataWithRetries("https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/outpost.geojson")
            ]);
            
            // 2. DATA PROCESSING
            const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
            const formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S Z");
            let combinedData = [];
            incidentData.features.forEach((d, i) => {
                const time = parseTime(d.properties.timestamp);
                if (time) { d.properties.time = time; d.properties.unique_id = `inc-${i}`; combinedData.push({ id: d.properties.id, category: 'Incident', description: d.properties.type, time: d.properties.time, details: `Severity: ${d.properties.severity}`, unique_id: d.properties.unique_id, originalData: d }); }
            });
            const [minTime, maxTime] = d3.extent(incidentData.features, d => d.properties.time);
            outpostData.features.forEach((d, i) => {
                const time = parseTime(d.properties.deployment_date);
                if(time) { d.properties.time = time; d.properties.unique_id = `outpost-${i}`; combinedData.push({ id: d.properties.id, category: 'Asset', description: d.properties.name, time: d.properties.time, details: `Status: ${d.properties.status}`, unique_id: d.properties.unique_id, originalData: d }); }
            });

            // 3. MAP & CORE OBJECT CREATION
            const map = L.map('map').setView([30.5, -105], 6);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 20 }).addTo(map);
            setTimeout(() => map.invalidateSize(), 100);

            const tableBody = d3.select("#table-body");
            const slider = d3.select("#time-slider");
            const incidentColorScale = d3.scaleOrdinal().domain(["HIGH", "MEDIUM", "LOW"]).range(["#ef4444", "#f97316", "#eab308"]);
            const incidentTypeColorScale = d3.scaleOrdinal(d3.schemeCategory10);
            
            const aorLayer = L.geoJSON(aorData, { style: { color: "white", weight: 1, dashArray: '3, 5', fill: false, fillOpacity: 0 } }).addTo(map);
            const incidentLayer = L.geoJSON(incidentData, {
                pointToLayer: (f, l) => L.marker(l, { icon: L.divIcon({ className: 'leaflet-div-icon', html: `<span class="material-symbols-outlined" style="color: ${incidentColorScale(f.properties.severity)};">explosion</span>`, iconSize: [24, 24], iconAnchor: [12, 12] }) }),
                onEachFeature: (f, l) => { l.bindTooltip(`<strong>Incident:</strong> ${f.properties.id}<br/><strong>Type:</strong> ${f.properties.type}`, { className: 'leaflet-tooltip' }); l.options.unique_id = f.properties.unique_id; }
            });
            const outpostLayer = L.geoJSON(outpostData, {
                pointToLayer: (f, l) => L.marker(l, { icon: L.divIcon({ className: 'leaflet-div-icon outpost-icon', html: `<span class="material-symbols-outlined" style="color: #84CC16;">change_history</span>`, iconSize: [24, 24], iconAnchor: [12, 12] }) }),
                onEachFeature: (f, l) => { l.bindTooltip(`<strong>Asset:</strong> ${f.properties.name}<br/><strong>Status:</strong> ${f.properties.status}`, { className: 'leaflet-tooltip' }); l.options.unique_id = f.properties.unique_id; }
            }).addTo(map);

            const clusterLayer = L.markerClusterGroup();
            clusterLayer.addLayer(incidentLayer);
            map.addLayer(clusterLayer);
            
            let currentSelectedItems = new Set();
            
            // 4. CONFIGURABLE / CHANGEABLE FUNCTIONS
            function updateKPIs(data) { const incidents = data.filter(d => d.category === 'Incident'); const assets = data.filter(d => d.category === 'Asset'); d3.select("#kpi-total-incidents").text(incidents.length); d3.select("#kpi-high-severity").text(incidents.filter(d => d.originalData.properties.severity === 'HIGH').length); d3.select("#kpi-active-assets").text(assets.filter(d => d.originalData.properties.status === 'ACTIVE').length); }
            function renderTable(data) { tableBody.selectAll("tr").data(data, d => d.unique_id).join( enter => enter.append("tr").html(d => `<td class="p-2 border-t border-gray-700">${d.id}</td><td class="p-2 border-t border-gray-700">${d.category}</td><td class="p-2 border-t border-gray-700">${d.description}</td><td class="p-2 border-t border-gray-700">${formatTime(d.time)}</td><td class="p-2 border-t border-gray-700">${d.details}</td>`), update => update, exit => exit.remove() ).attr("id", d => `table-row-${d.unique_id}`).attr("class", "hover:bg-gray-700 cursor-pointer").on("mouseover", (e, d) => { const l = d.category === 'Incident' ? incidentLayer : outpostLayer; l.eachLayer(layer => { if (layer.options.unique_id === d.unique_id) layer.getElement()?.classList.add("map-point-highlight"); }); }).on("mouseout", (e, d) => { const l = d.category === 'Incident' ? incidentLayer : outpostLayer; l.eachLayer(layer => { if (layer.options.unique_id === d.unique_id) layer.getElement()?.classList.remove("map-point-highlight"); }); }); }
            const chartTooltip = d3.select("body").append("div").attr("class", "chart-tooltip");
            function drawDonutChart(incidentData) {
                const svg = d3.select("#donut-chart-container").html("").append("svg").attr("width", "100%").attr("height", "100%");
                if (incidentData.length === 0) return;
                const {width, height} = svg.node().getBoundingClientRect();
                const radius = Math.min(width, height) / 2 - 10;
                const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
                const data = d3.rollup(incidentData, v => v.length, d => d.originalData.properties.severity);
                const pie = d3.pie().value(d => d[1]);
                const path = d3.arc().outerRadius(radius).innerRadius(radius - 30);
                const arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")
                    .on("mouseover", (e, d) => chartTooltip.style("opacity", 1).html(`${d.data[0]}: ${d.data[1]}`).style("left", (e.pageX + 10) + "px").style("top", (e.pageY - 28) + "px"))
                    .on("mouseout", () => chartTooltip.style("opacity", 0));
                arcs.append("path").attr("d", path).attr("fill", d => incidentColorScale(d.data[0]));
                
                g.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", "-0.1em")
                    .style("font-size", "2.5em")
                    .style("font-weight", "bold")
                    .style("fill", "white")
                    .text(incidentData.length);
                
                g.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", "1.2em")
                    .style("font-size", "0.9em")
                    .style("fill", "#9CA3AF")
                    .text("Total Incidents");
            }
            function drawTreemapChart(incidentData) {
                const svg = d3.select("#treemap-chart-container").html("").append("svg").attr("width", "100%").attr("height", "100%");
                if (incidentData.length === 0) return;
                const {width, height} = svg.node().getBoundingClientRect();
                const data = { name: "root", children: Array.from(d3.rollup(incidentData, v => v.length, d => d.description), ([key, value]) => ({name: key, value: value})) };
                const root = d3.hierarchy(data).sum(d => d.value);
                d3.treemap().size([width, height]).padding(2)(root);
                const nodes = svg.selectAll("g").data(root.leaves()).enter().append("g")
                    .attr("transform", d => `translate(${d.x0},${d.y0})`)
                    .on("mouseover", (e, d) => chartTooltip.style("opacity", 1).html(`${d.data.name}: ${d.data.value}`).style("left", (e.pageX + 10) + "px").style("top", (e.pageY - 28) + "px"))
                    .on("mouseout", () => chartTooltip.style("opacity", 0));
                nodes.append("rect").attr("width", d => d.x1 - d.x0).attr("height", d => d.y1 - d.y0).attr("fill", d => incidentTypeColorScale(d.data.name));
                nodes.append("text")
                    .style("font-size", "13px")
                    .selectAll("tspan")
                    .data(d => `${d.data.name} (${d.data.value})`.split(/(?=[A-Z][^A-Z])/g))
                    .join("tspan")
                    .attr("x", 4)
                    .attr("y", (d, i) => 15 + i * 14)
                    .text(d => d);
            }

            function updateMapForTime(currentTimeMs) {
                const currentTime = new Date(parseInt(currentTimeMs));
                d3.select("#current-time").text(formatTime(currentTime));
                slider.property("value", currentTimeMs);
                
                const timeFilteredData = {
                    type: "FeatureCollection",
                    features: incidentData.features.filter(feature => parseTime(feature.properties.timestamp) <= currentTime)
                };

                incidentLayer.clearLayers().addData(timeFilteredData);
                clusterLayer.clearLayers().addLayer(incidentLayer);
            }

            function onSelectionChange(newSelection) {
                currentSelectedItems = newSelection;
                const selectedData = currentSelectedItems.size === 0 ? combinedData : combinedData.filter(d => currentSelectedItems.has(d.unique_id));
                renderTable(selectedData);
                updateKPIs(selectedData);
                drawDonutChart(selectedData.filter(d => d.category === 'Incident'));
                drawTreemapChart(selectedData.filter(d => d.category === 'Incident'));
            }

            // 5. INITIALIZATION - WIRING EVERYTHING TOGETHER
            const densityLayer = MapComponents.setupHexbinLayer(map, incidentData);
            const legendLayers = { "AOR": aorLayer, "Clusters": clusterLayer, "Incidents": incidentLayer, "Outposts": outpostLayer, "Density": densityLayer };
            
            map.removeLayer(incidentLayer);
            map.removeLayer(densityLayer);

            MapComponents.setupLayerToggle(map, legendLayers, updateMapForTime, slider);
            MapComponents.setupSelectionTools(map, [incidentLayer, outpostLayer], onSelectionChange);
            MapComponents.setupTableFilter(combinedData, renderTable, updateKPIs);
            MapComponents.setupTimelineControls({ minTime, maxTime }, updateMapForTime);

            // Initial render
            onSelectionChange(new Set());
            if(maxTime) updateMapForTime(maxTime.getTime());

        } catch (error) {
            console.error("Failed to initialize the application:", error);
            document.body.innerHTML = `<div class="w-full h-screen flex items-center justify-center bg-gray-900 text-red-400"><p>Error loading map data. Please check the console and refresh the page.</p></div>`;
        }
    }

    initializeApp();
});
