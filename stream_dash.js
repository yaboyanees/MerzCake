document.addEventListener('DOMContentLoaded', () => {
        
    // --- DATA ---
    const tableData = [
        { name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Garrett Winters', position: 'Accountant', office: 'Tokyo', age: 63, startDate: '2011/07/25', salary: '$170,750', country: 'Japan', lat: 35.6895, lng: 139.6917 },
        { name: 'Ashton Cox', position: 'Junior Technical Author', office: 'San Francisco', age: 66, startDate: '2009/01/12', salary: '$86,000', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Cedric Kelly', position: 'Senior Javascript Developer', office: 'Edinburgh', age: 22, startDate: '2012/03/29', salary: '$433,060', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Airi Satou', position: 'Accountant', office: 'Tokyo', age: 33, startDate: '2008/11/28', salary: '$162,700', country: 'Japan', lat: 35.6895, lng: 139.6917 },
        { name: 'Brielle Williamson', position: 'Integration Specialist', office: 'New York', age: 61, startDate: '2012/12/02', salary: '$372,000', country: 'United States of America', lat: 40.7128, lng: -74.0060 },
        { name: 'Herrod Chandler', position: 'Sales Assistant', office: 'San Francisco', age: 59, startDate: '2012/08/06', salary: '$137,500', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Rhona Davidson', position: 'Integration Specialist', office: 'Tokyo', age: 55, startDate: '2010/10/14', salary: '$327,900', country: 'Japan', lat: 35.6895, lng: 139.6917 },
        { name: 'Colleen Hurst', position: 'Javascript Developer', office: 'San Francisco', age: 39, startDate: '2009/09/15', salary: '$205,500', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Sonya Frost', position: 'Software Engineer', office: 'Edinburgh', age: 23, startDate: '2008/12/13', salary: '$103,600', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Jena Gaines', position: 'Office Manager', office: 'London', age: 30, startDate: '2008/12/19', salary: '$90,560', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
        { name: 'Quinn Flynn', position: 'Support Lead', office: 'Edinburgh', age: 22, startDate: '2013/03/03', salary: '$342,000', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Charde Marshall', position: 'Regional Director', office: 'San Francisco', age: 36, startDate: '2008/10/16', salary: '$470,600', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Haley Kennedy', position: 'Senior Marketing Designer', office: 'London', age: 43, startDate: '2012/12/18', salary: '$313,500', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
        { name: 'Tatyana Fitzpatrick', position: 'Regional Director', office: 'London', age: 19, startDate: '2010/03/17', salary: '$385,750', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    ];

    // --- KPI LOGIC ---
    function calculateAndUpdateKPIs() {
        const totalSalary = tableData.reduce((acc, curr) => acc + Number(curr.salary.replace(/[^0-9.-]+/g, "")), 0);
        document.getElementById('kpi-total-salary').textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalSalary);
        const totalEmployees = tableData.length;
        document.getElementById('kpi-total-employees').textContent = totalEmployees.toLocaleString();
        const uniqueOffices = new Set(tableData.map(d => d.office)).size;
        document.getElementById('kpi-unique-offices').textContent = uniqueOffices;
        const totalAge = tableData.reduce((acc, curr) => acc + curr.age, 0);
        const averageAge = totalAge / totalEmployees;
        document.getElementById('kpi-average-age').textContent = averageAge.toFixed(1);
    }
    
    // --- CUSTOM DATA TABLE LOGIC ---
    const state = {
        data: tableData,
        filteredData: tableData,
        rowsPerPage: 5,
        currentPage: 1,
        sortColumn: 'name',
        sortDirection: 'asc',
        searchQuery: '',
    };
    const headers = { name: 'Name', position: 'Position', office: 'Office', country: 'Country', age: 'Age', startDate: 'Start Date', salary: 'Salary' };

    // --- D3 & LEAFLET VISUALIZATIONS ---
    const tooltip = d3.select("#chart-tooltip");
    const officeCounts = Array.from(d3.rollup(tableData, v => v.length, d => d.office), ([key, value]) => ({key, value}));
    const ageSalaryData = tableData.map(d => ({ age: d.age, salary: Number(d.salary.replace(/[^0-9.-]+/g,"")) }));
    const positions = [...new Set(tableData.map(d => d.position))];
    const officePositionCounts = Array.from(d3.group(tableData, d => d.office), ([office, values]) => {
        const counts = { office };
        positions.forEach(pos => { counts[pos] = values.filter(d => d.position === pos).length; });
        return counts;
    });
    const stack = d3.stack().keys(positions);
    const stackedData = stack(officePositionCounts);
    const chartSvg = d3.select("#dynamic-chart");
    const chartMargin = {top: 20, right: 20, bottom: 40, left: 60};

    function getChartDimensions() {
        const chartNode = chartSvg.node();
        if (!chartNode) return { width: 0, height: 0, innerWidth: 0, innerHeight: 0 };
        const { width, height } = chartNode.getBoundingClientRect();
        return { width, height, innerWidth: width - chartMargin.left - chartMargin.right, innerHeight: height - chartMargin.top - chartMargin.bottom };
    }

    function renderBarChart() {
        const { innerWidth, innerHeight } = getChartDimensions();
        if (innerWidth <= 0) return;
        chartSvg.selectAll("*").remove();
        const g = chartSvg.append("g").attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);
        const x = d3.scaleLinear().domain([0, d3.max(officeCounts, d => d.value)]).nice().range([0, innerWidth]);
        const y = d3.scaleBand().domain(officeCounts.map(d => d.key)).range([innerHeight, 0]).padding(0.1);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        const bars = g.selectAll(".bar").data(officeCounts).enter();
        bars.append("rect").attr("class", "fill-blue-500 hover:fill-blue-400 transition-colors").attr("x", 0).attr("y", d => y(d.key)).attr("width", d => x(d.value)).attr("height", y.bandwidth())
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`<b>${d.key}</b><br>${d.value} employees`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
        bars.append("text").attr("class", "fill-white font-bold text-xs pointer-events-none").attr("x", 5).attr("y", d => y(d.key) + y.bandwidth() / 2).attr("dy", "0.35em").text(d => d.value);
    }

    function renderColumnChart() {
        const { innerWidth, innerHeight } = getChartDimensions();
        if (innerWidth <= 0) return;
        chartSvg.selectAll("*").remove();
        const g = chartSvg.append("g").attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);
        const x = d3.scaleBand().domain(officeCounts.map(d => d.key)).range([0, innerWidth]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(officeCounts, d => d.value)]).nice().range([innerHeight, 0]);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        const bars = g.selectAll(".bar").data(officeCounts).enter();
        bars.append("rect").attr("class", "fill-blue-500 hover:fill-blue-400 transition-colors").attr("x", d => x(d.key)).attr("y", d => y(d.value)).attr("width", x.bandwidth()).attr("height", d => innerHeight - y(d.value))
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`<b>${d.key}</b><br>${d.value} employees`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
        bars.append("text").attr("class", "fill-white font-bold text-xs pointer-events-none").attr("x", d => x(d.key) + x.bandwidth() / 2).attr("y", innerHeight - 5).attr("text-anchor", "middle").text(d => d.value);
    }

    function renderStackedBarChart() {
        const { innerWidth, innerHeight } = getChartDimensions();
        if (innerWidth <= 0) return;
        chartSvg.selectAll("*").remove();
        const g = chartSvg.append("g").attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);
        const x = d3.scaleBand().domain(officePositionCounts.map(d => d.office)).range([0, innerWidth]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice().range([innerHeight, 0]);
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append("g").selectAll("g").data(stackedData).join("g").attr("fill", d => color(d.key)).selectAll("rect").data(d => d).join("rect").attr("x", d => x(d.data.office)).attr("y", d => y(d[1])).attr("height", d => y(d[0]) - y(d[1])).attr("width", x.bandwidth())
            .on("mouseover", (event, d) => {
                const position = d3.select(event.currentTarget.parentNode).datum().key;
                tooltip.style("opacity", 1).html(`<b>${d.data.office}</b><br>${position}: ${d[1] - d[0]}`);
            })
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
        const totals = officePositionCounts.map(d => d3.sum(positions, pos => d[pos]));
        g.selectAll(".total-label").data(totals).enter().append("text").attr("class", "fill-white font-bold text-xs pointer-events-none").attr("x", (d, i) => x(officePositionCounts[i].office) + x.bandwidth() / 2).attr("y", d => y(d) - 5).attr("text-anchor", "middle").text(d => d);
    }

    function renderPieChart(isDonut = false) {
        const { width, height } = getChartDimensions();
        if (width <= 0) return;
        chartSvg.selectAll("*").remove();
        const radius = Math.min(width, height) / 2 - 10;
        const g = chartSvg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const pie = d3.pie().value(d => d.value);
        const path = d3.arc().outerRadius(radius).innerRadius(isDonut ? radius / 2 : 0);
        const total = d3.sum(officeCounts, d => d.value);
        const arcs = g.selectAll(".arc").data(pie(officeCounts)).enter().append("g").attr("class", "arc");
        arcs.append("path").attr("d", path).attr("fill", d => color(d.data.key))
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`<b>${d.data.key}</b><br>${d.data.value} employees`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
        arcs.append("text").attr("transform", d => `translate(${path.centroid(d)})`).attr("dy", "0.35em").attr("class", "text-xs fill-white pointer-events-none").style("text-anchor", "middle").text(d => d.data.value);
        if (isDonut) {
            g.append("text").attr("text-anchor", "middle").attr("class", "fill-gray-200 text-2xl font-bold").attr('dy', '0.1em').text(total);
            g.append("text").attr("text-anchor", "middle").attr("class", "fill-gray-400 text-xs").attr('dy', '1.2em').text("Total");
        }
    }

    function renderLineChart() {
        const { innerWidth, innerHeight } = getChartDimensions();
        if (innerWidth <= 0) return;
        chartSvg.selectAll("*").remove();
        const g = chartSvg.append("g").attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);
        const sortedData = [...ageSalaryData].sort((a, b) => a.age - b.age);
        const x = d3.scaleLinear().domain(d3.extent(sortedData, d => d.age)).range([0, innerWidth]);
        const y = d3.scaleLinear().domain([0, d3.max(sortedData, d => d.salary)]).nice().range([innerHeight, 0]);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
        g.append("path").datum(sortedData).attr("fill", "none").attr("stroke", "#3b82f6").attr("stroke-width", 1.5).attr("d", d3.line().x(d => x(d.age)).y(d => y(d.salary)));
        g.selectAll("dot").data(sortedData).enter().append("circle").attr("r", 4).attr("cx", d => x(d.age)).attr("cy", d => y(d.salary)).attr("class", "fill-blue-500")
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`Age: ${d.age}<br>Salary: $${d.salary.toLocaleString()}`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
    }

    function renderScatterPlot() {
        const { innerWidth, innerHeight } = getChartDimensions();
        if (innerWidth <= 0) return;
        chartSvg.selectAll("*").remove();
        const g = chartSvg.append("g").attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);
        const x = d3.scaleLinear().domain(d3.extent(ageSalaryData, d => d.age)).nice().range([0, innerWidth]);
        const y = d3.scaleLinear().domain([0, d3.max(ageSalaryData, d => d.salary)]).nice().range([innerHeight, 0]);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
        g.selectAll("circle").data(ageSalaryData).enter().append("circle").attr("cx", d => x(d.age)).attr("cy", d => y(d.salary)).attr("r", 4).attr("class", "fill-blue-500 opacity-70")
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`Age: ${d.age}<br>Salary: $${d.salary.toLocaleString()}`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
    }

    const chartRenderers = { bar: renderBarChart, column: renderColumnChart, stack: renderStackedBarChart, pie: () => renderPieChart(false), donut: () => renderPieChart(true), line: renderLineChart, scatter: renderScatterPlot };
    document.getElementById('chart-toggles').addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const chartType = button.dataset.chart;
            document.querySelectorAll('#chart-toggles button').forEach(btn => {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('text-gray-300', 'hover:bg-gray-600');
            });
            button.classList.add('bg-blue-500', 'text-white');
            button.classList.remove('text-gray-300', 'hover:bg-gray-600');
            chartRenderers[chartType]();
        }
    });

    async function initEmployeeMap() {
        const leafletMapEl = document.getElementById('leaflet-map');
        if (!leafletMapEl) return;
        const map = L.map('leaflet-map', { attributionControl: false }).setView([20, 0], 2);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', subdomains: 'abcd', maxZoom: 20 }).addTo(map);
        let statesLayer, countriesLayer, officeMarkersGroup;
        const employeeCountsByCountry = d3.rollup(tableData, v => v.length, d => d.country);
        const employeeCountsByOffice = d3.rollup(tableData, v => v.length, d => d.office);
        const maxCount = d3.max(employeeCountsByCountry.values());
        const colorScale = d3.scaleQuantize([0, maxCount], ['#eff3ff', '#bdd7e7', '#6baed6', '#2171b5']);
        const defaultStyle = { color: "#4b5563", weight: 0.5, fillOpacity: 1 };
        const highlightStyle = { color: "#9ca3af", weight: 1.5 };
        const defaultStateStyle = { color: "#6b7280", weight: 0.5, fillOpacity: 0 };
        const highlightStateStyle = { color: "#e5e7eb", weight: 1 };
        try {
            const countriesData = await d3.json('https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/country_borders.geojson');
            countriesLayer = L.geoJSON(countriesData, {
                style: (f) => ({ ...defaultStyle, fillColor: employeeCountsByCountry.get(f.properties.admin) ? colorScale(employeeCountsByCountry.get(f.properties.admin)) : '#374151' }),
                onEachFeature: (feature, layer) => {
                    const count = employeeCountsByCountry.get(feature.properties.admin) || 0;
                    layer.bindTooltip(`<b>${feature.properties.admin}</b><br>${count} employees`, { sticky: true });
                    layer.on({ mouseover: (e) => e.target.setStyle(highlightStyle), mouseout: (e) => countriesLayer.resetStyle(e.target) });
                }
            }).addTo(map);
        } catch (error) { console.error("Error loading country border data:", error); }
        try {
            const statesData = await d3.json('https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/us_state_borders.geojson');
            statesLayer = L.geoJSON(statesData, { style: defaultStateStyle, onEachFeature: (f, l) => { if (f.properties && f.properties.NAME) { l.bindTooltip(f.properties.NAME, { sticky: true }); } l.on({ mouseover: (e) => e.target.setStyle(highlightStateStyle), mouseout: (e) => statesLayer.resetStyle(e.target) }); } });
        } catch (error) { console.error("Error loading state border data:", error); }
        const uniqueOffices = Array.from(new Set(tableData.map(d => d.office))).map(office => tableData.find(d => d.office === office));
        const officeIcon = L.divIcon({ html: `<span class="material-symbols-outlined" style="font-size: 24px; color: #f59e0b;">place</span>`, className: '', iconSize: [24, 24], iconAnchor: [12, 24] });
        officeMarkersGroup = L.layerGroup(uniqueOffices.map(office => L.marker([office.lat, office.lng], { icon: officeIcon }).bindTooltip(`${office.office}<br>${employeeCountsByOffice.get(office.office) || 0} employees`))).addTo(map);
        map.on('zoomend', () => {
            const statesVisible = document.getElementById('toggle-states').checked;
            if (map.getZoom() >= 4 && statesVisible && statesLayer && !map.hasLayer(statesLayer)) map.addLayer(statesLayer);
            else if (statesLayer && map.hasLayer(statesLayer)) map.removeLayer(statesLayer);
        });
        const legend = L.control({position: 'topright'});
        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'legend-control');
            div.innerHTML = `<h4 class="legend-title">Employees</h4><div class="legend-scale"><ul></ul></div><div class="legend-toggles">
                <label><input type="checkbox" id="toggle-countries" checked> Countries</label>
                <label><input type="checkbox" id="toggle-states" checked> US States</label>
                <label><input type="checkbox" id="toggle-offices" checked> Offices</label></div>`;
            const grades = [0, ...colorScale.thresholds()];
            grades.forEach((from, i) => { const to = grades[i + 1]; div.querySelector('ul').innerHTML += `<li><i style="background:${colorScale(from + 1)}"></i> ${from + (to ? '&ndash;' + to : '+')}</li>`; });
            L.DomEvent.disableClickPropagation(div);
            return div;
        };
        legend.addTo(map);
        document.getElementById('toggle-countries').addEventListener('change', (e) => e.target.checked ? map.addLayer(countriesLayer) : map.removeLayer(countriesLayer));
        document.getElementById('toggle-states').addEventListener('change', (e) => { if (e.target.checked && map.getZoom() >= 4) map.addLayer(statesLayer); else map.removeLayer(statesLayer); });
        document.getElementById('toggle-offices').addEventListener('change', (e) => e.target.checked ? map.addLayer(officeMarkersGroup) : map.removeLayer(officeMarkersGroup));
        new ResizeObserver(() => map.invalidateSize()).observe(leafletMapEl);
    }

    async function initIncidentMaps() {
        const incidentsUrl = 'https://raw.githubusercontent.com/yaboyanees/MerzCake/main/incidents_data.geojson';
        const countriesUrl = 'https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/country_borders.geojson';
        const statesUrl = 'https://cdn.jsdelivr.net/gh/yaboyanees/MerzCake@main/us_state_borders.geojson';

        try {
            const [incidentsData, countriesData, statesData] = await Promise.all([
                d3.json(incidentsUrl),
                d3.json(countriesUrl),
                d3.json(statesUrl)
            ]);

            // --- Base Styles ---
            const countryBorderStyle = { color: "#4b5563", weight: 0.5, fillColor: '#1f2937', fillOpacity: 1, interactive: false };
            const stateBorderStyle = { color: "#6b7280", weight: 0.5, fillOpacity: 0, interactive: false };

            // --- Map 1: Custom Symbols ---
            const map1 = L.map('incident-map-1', { zoomControl: false }).setView([34.0522, -118.2437], 4);
            L.geoJSON(countriesData, { style: countryBorderStyle }).addTo(map1);
            L.geoJSON(statesData, { style: stateBorderStyle }).addTo(map1);

            const typeDetails = {
                'Illegal Activity': { icon: 'gavel', color: '#e67e22' },
                'Smuggling': { icon: 'luggage', color: '#3498db' },
                'Security Threat': { icon: 'security', color: '#e74c3c' },
                'Other': { icon: 'help_outline', color: '#95a5a6' }
            };
            const typeLayers = {};
            L.geoJSON(incidentsData, {
                onEachFeature: (feature, layer) => layer.bindTooltip(`<b>Type:</b> ${feature.properties.type}<br><b>Severity:</b> ${feature.properties.severity}`),
                pointToLayer: (feature, latlng) => {
                    const type = feature.properties.type;
                    if (!typeLayers[type]) {
                        typeLayers[type] = L.layerGroup().addTo(map1);
                    }
                    const details = typeDetails[type] || typeDetails['Other'];
                    const marker = L.marker(latlng, {
                        icon: L.divIcon({
                            html: `<span class="material-symbols-outlined" style="color: ${details.color}; font-size: 24px; text-shadow: 0 0 3px rgba(0,0,0,0.5);">${details.icon}</span>`,
                            className: 'google-font-marker',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })
                    });
                    marker.addTo(typeLayers[type]);
                    return marker;
                }
            });
            
            const legend1 = L.control({ position: 'topright' });
            legend1.onAdd = function () {
                const div = L.DomUtil.create('div', 'legend-control');
                div.innerHTML = '<h4 class="legend-title">Incident Type</h4>';
                for (const type in typeDetails) {
                    const details = typeDetails[type];
                    const typeId = type.replace(/\s+/g, '');
                    div.innerHTML += `<div class="legend-item"><input type="checkbox" id="toggle-${typeId}" checked><label for="toggle-${typeId}"><span class="material-symbols-outlined" style="color: ${details.color}; vertical-align: middle;">${details.icon}</span> ${type}</label></div>`;
                }
                L.DomEvent.disableClickPropagation(div);
                return div;
            };
            legend1.addTo(map1);
            legend1.getContainer().addEventListener('input', (e) => {
                if (e.target.tagName === 'INPUT') {
                    const typeName = e.target.id.replace('toggle-', '');
                    const typeKey = Object.keys(typeDetails).find(k => k.replace(/\s+/g, '') === typeName);
                    if (typeKey && typeLayers[typeKey]) {
                        e.target.checked ? map1.addLayer(typeLayers[typeKey]) : map1.removeLayer(typeLayers[typeKey]);
                    }
                }
            });
            new ResizeObserver(() => map1.invalidateSize()).observe(document.getElementById('incident-map-1'));

            // --- Map 2: Marker Clusters ---
            const map2 = L.map('incident-map-2', { zoomControl: false }).setView([34.0522, -118.2437], 4);
            L.geoJSON(countriesData, { style: countryBorderStyle }).addTo(map2);
            L.geoJSON(statesData, { style: stateBorderStyle }).addTo(map2);
            const markers = L.markerClusterGroup({
                 iconCreateFunction: function(cluster) {
                    const count = cluster.getChildCount();
                    let c = ' marker-cluster-';
                    if (count < 10) { c += 'small'; } 
                    else if (count < 100) { c += 'medium'; } 
                    else { c += 'large'; }
                    return new L.DivIcon({ html: '<div><span>' + count + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
                }
            });
            const geoJsonLayer = L.geoJSON(incidentsData, {
                onEachFeature: (feature, layer) => layer.bindTooltip(`<b>Type:</b> ${feature.properties.type}<br><b>Severity:</b> ${feature.properties.severity}`)
            });
            markers.addLayer(geoJsonLayer);
            map2.addLayer(markers);
            new ResizeObserver(() => map2.invalidateSize()).observe(document.getElementById('incident-map-2'));
            
            // --- Map 3: Heatmap ---
            const map3 = L.map('incident-map-3', { zoomControl: false }).setView([34.0522, -118.2437], 4);
            L.geoJSON(countriesData, { style: countryBorderStyle }).addTo(map3);
            L.geoJSON(statesData, { style: stateBorderStyle }).addTo(map3);
            const heatPoints = incidentsData.features.map(feature => [feature.geometry.coordinates[1], feature.geometry.coordinates[0], 0.5]); // lat, lng, intensity
            L.heatLayer(heatPoints, {
                radius: 20,
                blur: 30,
                maxZoom: 12,
                gradient: {0.4: '#fdbe85', 0.7: '#fd8d3c', 1: '#e6550d'} // Custom orange gradient
            }).addTo(map3);
            new ResizeObserver(() => map3.invalidateSize()).observe(document.getElementById('incident-map-3'));

        } catch (error) {
            console.error("Failed to load map GeoJSON data:", error);
            document.getElementById('incidents-container').innerHTML = `<p class="text-center text-red-500 col-span-3">Could not load incident map data.</p>`;
        }
    }
    
    // --- REORDERING (Drag and Drop Sections) ---
    new Sortable(document.getElementById('dashboard-container'), { animation: 150, handle: '.drag-handle', ghostClass: 'is-dragging' });

    function renderTable() {
        let data = state.data;
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            data = data.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(query)));
        }
        state.filteredData = data;
        data.sort((a, b) => {
            const valA = a[state.sortColumn]; const valB = b[state.sortColumn];
            if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        const start = (state.currentPage - 1) * state.rowsPerPage;
        const paginatedData = data.slice(start, start + state.rowsPerPage);
        document.getElementById('table-body').innerHTML = paginatedData.map(row => `
            <tr class="hover:bg-gray-700/50">${Object.keys(headers).map(key => `<td class="px-6 py-4">${row[key]}</td>`).join('')}</tr>`).join('');
        updatePagination();
    }
    
    function updatePagination() {
        const totalRows = state.filteredData.length;
        const totalPages = Math.ceil(totalRows / state.rowsPerPage);
        state.currentPage = Math.min(state.currentPage, totalPages) || 1;
        document.getElementById('page-info').textContent = `Page ${state.currentPage} of ${totalPages}`;
        const startRow = Math.min((state.currentPage - 1) * state.rowsPerPage + 1, totalRows);
        const endRow = Math.min(state.currentPage * state.rowsPerPage, totalRows);
        document.getElementById('table-info').textContent = `Showing ${startRow} to ${endRow} of ${totalRows} entries`;
        document.getElementById('prev-page').disabled = state.currentPage === 1;
        document.getElementById('next-page').disabled = state.currentPage === totalPages;
    }
    
    function setupControls() {
        const tableHeaders = document.getElementById('table-headers');
        tableHeaders.innerHTML = Object.entries(headers).map(([key, title]) => {
            const icon = state.sortColumn === key ? (state.sortDirection === 'asc' ? '▲' : '▼') : '';
            return `<th scope="col" class="px-6 py-3 cursor-pointer" data-sort-key="${key}">${title} <span class="text-xs">${icon}</span></th>`;
        }).join('');
        tableHeaders.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                const key = th.dataset.sortKey;
                if (state.sortColumn === key) { state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'; } 
                else { state.sortColumn = key; state.sortDirection = 'asc'; }
                setupControls(); renderTable();
            });
        });
        document.getElementById('table-search').addEventListener('input', (e) => { state.searchQuery = e.target.value; state.currentPage = 1; renderTable(); });
        document.getElementById('prev-page').addEventListener('click', () => { if (state.currentPage > 1) { state.currentPage--; renderTable(); } });
        document.getElementById('next-page').addEventListener('click', () => { if (state.currentPage < Math.ceil(state.filteredData.length / state.rowsPerPage)) { state.currentPage++; renderTable(); } });
    }

    // --- INITIALIZE EVERYTHING ---
    calculateAndUpdateKPIs();
    setupControls();
    renderTable();
    renderBarChart();
    initEmployeeMap();
    initIncidentMaps();
});
