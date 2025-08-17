document.addEventListener('DOMContentLoaded', () => {
        
    const tableData = [
        { name: 'Tiger Nixon', position: 'System Architect', job_family: 'Technical', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Garrett Winters', position: 'Accountant', job_family: 'Finance', office: 'Tokyo', age: 63, startDate: '2011/07/25', salary: '$170,750', country: 'Japan', lat: 35.6895, lng: 139.6917 },
        { name: 'Ashton Cox', position: 'Junior Technical Author', job_family: 'Technical', office: 'San Francisco', age: 66, startDate: '2009/01/12', salary: '$86,000', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Cedric Kelly', position: 'Senior Javascript Developer', job_family: 'Technical', office: 'Edinburgh', age: 22, startDate: '2012/03/29', salary: '$433,060', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Airi Satou', position: 'Accountant', job_family: 'Finance', office: 'Tokyo', age: 33, startDate: '2008/11/28', salary: '$162,700', country: 'Japan', lat: 35.6895, lng: 139.6917 },
        { name: 'Brielle Williamson', position: 'Integration Specialist', job_family: 'Technical', office: 'New York', age: 61, startDate: '2012/12/02', salary: '$372,000', country: 'United States of America', lat: 40.7128, lng: -74.0060 },
        { name: 'Herrod Chandler', position: 'Sales Assistant', job_family: 'Sales', office: 'San Francisco', age: 59, startDate: '2012/08/06', salary: '$137,500', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Rhona Davidson', position: 'Integration Specialist', job_family: 'Technical', office: 'Tokyo', age: 55, startDate: '2010/10/14', salary: '$327,900', country: 'Japan', lat: 35.6895, lng: 139.6917 },
        { name: 'Colleen Hurst', position: 'Javascript Developer', job_family: 'Technical', office: 'San Francisco', age: 39, startDate: '2009/09/15', salary: '$205,500', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Sonya Frost', position: 'Software Engineer', job_family: 'Technical', office: 'Edinburgh', age: 23, startDate: '2008/12/13', salary: '$103,600', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Jena Gaines', position: 'Office Manager', job_family: 'Program', office: 'London', age: 30, startDate: '2008/12/19', salary: '$90,560', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
        { name: 'Quinn Flynn', position: 'Support Lead', job_family: 'Program', office: 'Edinburgh', age: 22, startDate: '2013/03/03', salary: '$342,000', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Charde Marshall', position: 'Regional Director', job_family: 'Program', office: 'San Francisco', age: 36, startDate: '2008/10/16', salary: '$470,600', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Haley Kennedy', position: 'Senior Marketing Designer', job_family: 'Program', office: 'London', age: 43, startDate: '2012/12/18', salary: '$313,500', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
        { name: 'Tatyana Fitzpatrick', position: 'Regional Director', job_family: 'Program', office: 'London', age: 19, startDate: '2010/03/17', salary: '$385,750', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
        { name: 'Michael Silva', position: 'Marketing Manager', job_family: 'Marketing', office: 'New York', age: 41, startDate: '2013/11/14', salary: '$198,500', country: 'United States of America', lat: 40.7128, lng: -74.0060 },
        { name: 'Paul Byrd', position: 'Chief Financial Officer (CFO)', job_family: 'Finance', office: 'London', age: 64, startDate: '2010/06/09', salary: '$725,000', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
        { name: 'Gloria Little', position: 'Systems Administrator', job_family: 'Technical', office: 'New York', age: 59, startDate: '2009/04/10', salary: '$237,500', country: 'United States of America', lat: 40.7128, lng: -74.0060 },
        { name: 'Bradley Greer', position: 'Software Engineer', job_family: 'Technical', office: 'London', age: 41, startDate: '2012/10/13', salary: '$132,000', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
        { name: 'Dai Rios', position: 'Personnel Lead', job_family: 'Human Resources', office: 'Edinburgh', age: 35, startDate: '2012/09/26', salary: '$217,500', country: 'United Kingdom', lat: 55.9533, lng: -3.1883 },
        { name: 'Jenette Caldwell', position: 'Development Lead', job_family: 'Technical', office: 'New York', age: 30, startDate: '2011/09/03', salary: '$345,000', country: 'United States of America', lat: 40.7128, lng: -74.0060 },
        { name: 'Yuri Berry', position: 'Chief Marketing Officer (CMO)', job_family: 'Marketing', office: 'Tokyo', age: 40, startDate: '2009/06/25', salary: '$675,000', country: 'Japan', lat: 35.6895, lng: 139.6917 },
        { name: 'Caesar Vance', position: 'Pre-Sales Support', job_family: 'Sales', office: 'San Francisco', age: 21, startDate: '2011/12/12', salary: '$106,450', country: 'United States of America', lat: 37.7749, lng: -122.4194 },
        { name: 'Doris Wilder', position: 'Sales Assistant', job_family: 'Sales', office: 'Sydney', age: 23, startDate: '2010/09/20', salary: '$85,600', country: 'Australia', lat: -33.8688, lng: 151.2093 },
        { name: 'Jackson Bradshaw', position: 'Director', job_family: 'Program', office: 'New York', age: 65, startDate: '2008/09/26', salary: '$645,750', country: 'United States of America', lat: 40.7128, lng: -74.0060 },
        { name: 'Olivia Parsons', position: 'Legal Counsel', job_family: 'Legal', office: 'Toronto', age: 38, startDate: '2014/05/11', salary: '$210,900', country: 'Canada', lat: 43.651070, lng: -79.347015 },
        { name: 'Fernando Morales', position: 'Regional Sales Manager', job_family: 'Sales', office: 'Mexico City', age: 44, startDate: '2010/07/01', salary: '$278,000', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
        { name: 'Amara Okafor', position: 'Operations Manager', job_family: 'Operations', office: 'Lagos', age: 37, startDate: '2015/02/17', salary: '$156,400', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
        { name: 'Sophie Dubois', position: 'Project Coordinator', job_family: 'Program', office: 'Paris', age: 29, startDate: '2016/09/22', salary: '$122,500', country: 'France', lat: 48.8566, lng: 2.3522 },
        { name: 'Rajesh Sharma', position: 'IT Support Specialist', job_family: 'Technical', office: 'Mumbai', age: 33, startDate: '2013/04/19', salary: '$88,200', country: 'India', lat: 19.0760, lng: 72.8777 },
        { name: 'Chen Wei', position: 'Data Analyst', job_family: 'Technical', office: 'Beijing', age: 27, startDate: '2018/11/01', salary: '$99,300', country: 'China', lat: 39.9042, lng: 116.4074 },
        { name: 'Isabella Rossi', position: 'Human Resources Specialist', job_family: 'Human Resources', office: 'Rome', age: 31, startDate: '2011/05/15', salary: '$110,800', country: 'Italy', lat: 41.9028, lng: 12.4964 },
        { name: 'Lucas Müller', position: 'Finance Analyst', job_family: 'Finance', office: 'Berlin', age: 35, startDate: '2012/06/30', salary: '$134,600', country: 'Germany', lat: 52.5200, lng: 13.4050 },
        { name: 'Fatima Zahra', position: 'Research Scientist', job_family: 'Research', office: 'Casablanca', age: 42, startDate: '2009/08/11', salary: '$150,200', country: 'Morocco', lat: 33.5731, lng: -7.5898 },
        { name: 'Carlos Alvarez', position: 'Program Manager', job_family: 'Program', office: 'Buenos Aires', age: 39, startDate: '2010/12/03', salary: '$182,400', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
        { name: 'Emily Johnson', position: 'UX Designer', job_family: 'Design', office: 'Chicago', age: 28, startDate: '2017/03/09', salary: '$97,800', country: 'United States of America', lat: 41.8781, lng: -87.6298 },
        { name: 'Ahmed Hassan', position: 'Security Analyst', job_family: 'Technical', office: 'Dubai', age: 34, startDate: '2014/11/23', salary: '$145,600', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
        { name: 'Hiroshi Tanaka', position: 'Business Analyst', job_family: 'Finance', office: 'Osaka', age: 46, startDate: '2007/05/19', salary: '$210,300', country: 'Japan', lat: 34.6937, lng: 135.5023 },
        { name: 'Liam O\'Connor', position: 'Training Specialist', job_family: 'Human Resources', office: 'Dublin', age: 40, startDate: '2012/10/21', salary: '$125,900', country: 'Ireland', lat: 53.3331, lng: -6.2489 },
        { name: 'Sophia Brown', position: 'Medical Advisor', job_family: 'Healthcare', office: 'Boston', age: 50, startDate: '2008/09/14', salary: '$198,700', country: 'United States of America', lat: 42.3601, lng: -71.0589 },
        { name: 'Pedro Souza', position: 'Logistics Coordinator', job_family: 'Operations', office: 'São Paulo', age: 36, startDate: '2015/07/30', salary: '$142,000', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
        { name: 'Hanna Schmidt', position: 'Legal Associate', job_family: 'Legal', office: 'Frankfurt', age: 32, startDate: '2016/01/18', salary: '$118,900', country: 'Germany', lat: 50.1109, lng: 8.6821 },
        { name: 'Ava Wilson', position: 'Creative Director', job_family: 'Design', office: 'Los Angeles', age: 45, startDate: '2009/06/10', salary: '$275,000', country: 'United States of America', lat: 34.0522, lng: -118.2437 },
        { name: 'Ethan Lee', position: 'Mobile Developer', job_family: 'Technical', office: 'Seoul', age: 29, startDate: '2018/04/16', salary: '$121,500', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
        { name: 'Noah Anderson', position: 'Environmental Consultant', job_family: 'Research', office: 'Copenhagen', age: 41, startDate: '2011/11/27', salary: '$166,300', country: 'Denmark', lat: 55.6761, lng: 12.5683 },
        { name: 'Camila Torres', position: 'Program Coordinator', job_family: 'Program', office: 'Bogotá', age: 27, startDate: '2019/01/08', salary: '$89,500', country: 'Colombia', lat: 4.7110, lng: -74.0721 },
        { name: 'David Kim', position: 'Product Manager', job_family: 'Program', office: 'San Jose', age: 38, startDate: '2012/02/15', salary: '$158,400', country: 'United States of America', lat: 37.3382, lng: -121.8863 },
        { name: 'Noura El-Sayed', position: 'Policy Analyst', job_family: 'Research', office: 'Cairo', age: 44, startDate: '2007/12/09', salary: '$135,600', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
        { name: 'William Scott', position: 'Chief Technology Officer (CTO)', job_family: 'Technical', office: 'Austin', age: 52, startDate: '2005/07/22', salary: '$480,000', country: 'United States of America', lat: 30.2672, lng: -97.7431 },
    ];

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
    const headers = { name: 'Name', position: 'Position', job_family: 'Job Family', office: 'Office', country: 'Country', age: 'Age', startDate: 'Start Date', salary: 'Salary' };

    // --- D3 & LEAFLET VISUALIZATIONS ---
    const tooltip = d3.select("#chart-tooltip");
    const countryCounts = Array.from(d3.rollup(tableData, v => v.length, d => d.country), ([key, value]) => ({key, value}));
    const ageSalaryData = tableData.map(d => ({ age: d.age, salary: Number(d.salary.replace(/[^0-9.-]+/g,"")) }));
    const positions = [...new Set(tableData.map(d => d.position))];
    const countryPositionCounts = Array.from(d3.group(tableData, d => d.country), ([country, values]) => {
        const counts = { country };
        positions.forEach(pos => { counts[pos] = values.filter(d => d.position === pos).length; });
        return counts;
    });
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
        const x = d3.scaleLinear().domain([0, d3.max(countryCounts, d => d.value)]).nice().range([0, innerWidth]);
        const y = d3.scaleBand().domain(countryCounts.map(d => d.key)).range([innerHeight, 0]).padding(0.1);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        const bars = g.selectAll(".bar").data(countryCounts).enter();
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
        const x = d3.scaleBand().domain(countryCounts.map(d => d.key)).range([0, innerWidth]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(countryCounts, d => d.value)]).nice().range([innerHeight, 0]);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        const bars = g.selectAll(".bar").data(countryCounts).enter();
        bars.append("rect").attr("class", "fill-blue-500 hover:fill-blue-400 transition-colors").attr("x", d => x(d.key)).attr("y", d => y(d.value)).attr("width", x.bandwidth()).attr("height", d => innerHeight - y(d.value))
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`<b>${d.key}</b><br>${d.value} employees`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
        bars.append("text").attr("class", "fill-white font-bold text-xs pointer-events-none").attr("x", d => x(d.key) + x.bandwidth() / 2).attr("y", d => y(d.value) - 5).attr("text-anchor", "middle").text(d => d.value);
    }

    function renderStackedBarChart() {
        const { innerWidth, innerHeight } = getChartDimensions();
        if (innerWidth <= 0) return;
        chartSvg.selectAll("*").remove();
        const g = chartSvg.append("g").attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);
        const stack = d3.stack().keys(positions);
        const stackedData = stack(countryPositionCounts);
        const x = d3.scaleBand().domain(countryPositionCounts.map(d => d.country)).range([0, innerWidth]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice().range([innerHeight, 0]);
        const color = d3.scaleOrdinal(d3.schemeTableau10);
        g.append("g").attr("class", "chart-axis").call(d3.axisLeft(y));
        g.append("g").attr("class", "chart-axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x));
        g.append("g").selectAll("g").data(stackedData).join("g").attr("fill", d => color(d.key)).selectAll("rect").data(d => d).join("rect").attr("x", d => x(d.data.country)).attr("y", d => y(d[1])).attr("height", d => y(d[0]) - y(d[1])).attr("width", x.bandwidth())
            .on("mouseover", (event, d) => {
                const position = d3.select(event.currentTarget.parentNode).datum().key;
                tooltip.style("opacity", 1).html(`<b>${d.data.country}</b><br>${position}: ${d[1] - d[0]}`);
            })
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
    }

    function renderPieChart(isDonut = false) {
        const { width, height } = getChartDimensions();
        if (width <= 0) return;
        chartSvg.selectAll("*").remove();
        const radius = Math.min(width, height) / 2 - 10;
        const g = chartSvg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);
        const color = d3.scaleOrdinal(d3.schemePaired);
        const pie = d3.pie().value(d => d.value);
        const path = d3.arc().outerRadius(radius).innerRadius(isDonut ? radius / 2 : 0);
        const total = d3.sum(countryCounts, d => d.value);
        const arcs = g.selectAll(".arc").data(pie(countryCounts)).enter().append("g").attr("class", "arc");
        arcs.append("path").attr("d", path).attr("fill", d => color(d.data.key))
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`<b>${d.data.key}</b><br>${d.data.value} employees`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));
        
        arcs.filter(d => (d.endAngle - d.startAngle) > 0.25).append("text")
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("dy", "0.35em").attr("class", "text-xs fill-white pointer-events-none")
            .style("text-anchor", "middle").text(d => d.data.value);
            
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
    
    // Initial chart render and resize observer
    new ResizeObserver(() => {
        const activeChartType = document.querySelector('#chart-toggles .bg-blue-500').dataset.chart;
        chartRenderers[activeChartType]();
    }).observe(document.getElementById('viz-container'));

async function initEmployeeMap() {
    const leafletMapEl = document.getElementById('leaflet-map');
    if (!leafletMapEl) return;
    const map = L.map('leaflet-map', { attributionControl: false }).setView([20, 0], 2);
    
    // REMOVED: The L.tileLayer line that added the CartoDB base map is now gone.
    
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

            const countryBorderStyle = { color: "#4b5563", weight: 0.5, fillColor: '#1f2937', fillOpacity: 1, interactive: false };
            const stateBorderStyle = { color: "#6b7280", weight: 0.5, fillOpacity: 0, interactive: false };

            // --- Map 1: Custom Symbols ---
            const map1 = L.map('incident-map-1', { zoomControl: false, maxZoom: 18 }).setView([34.0522, -118.2437], 4);
            L.geoJSON(countriesData, { style: countryBorderStyle }).addTo(map1);
            L.geoJSON(statesData, { style: stateBorderStyle }).addTo(map1);
            const typeDetails = {
                'Smuggling Attempt': { icon: 'luggage', color: '#3498db' },
                'Illegal Activity': { icon: 'gavel', color: '#e67e22' },
                'Mass Migration Event': { icon: 'groups', color: '#9b59b6' },
                'WMD/CBRN Threat Incident': { icon: 'caution', color: '#e74c3c' },
                'Unknown Activity': { icon: 'help_outline', color: '#95a5a6' }
            };
            const typeLayers = {};
            L.geoJSON(incidentsData, {
                onEachFeature: (feature, layer) => layer.bindTooltip(`<b>Type:</b> ${feature.properties.type}<br><b>Severity:</b> ${feature.properties.severity}`),
                pointToLayer: (feature, latlng) => {
                    const type = feature.properties.type;
                    if (!typeLayers[type]) { typeLayers[type] = L.layerGroup().addTo(map1); }
                    const details = typeDetails[type] || typeDetails['Unknown Activity'];
                    const marker = L.marker(latlng, {
                        icon: L.divIcon({
                            html: `<span class="material-symbols-outlined" style="color: ${details.color}; font-size: 24px; text-shadow: 0 0 3px rgba(0,0,0,0.5);">${details.icon}</span>`,
                            className: 'google-font-marker', iconSize: [24, 24], iconAnchor: [12, 12]
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
            const map2 = L.map('incident-map-2', { zoomControl: false, maxZoom: 18 }).setView([34.0522, -118.2437], 4);
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
            const map3 = L.map('incident-map-3', { zoomControl: false, maxZoom: 18 }).setView([34.0522, -118.2437], 4);
            map3.createPane('borderPane');
            map3.getPane('borderPane').style.zIndex = 250;
            L.geoJSON(countriesData, { style: countryBorderStyle, pane: 'borderPane' }).addTo(map3);
            L.geoJSON(statesData, { style: stateBorderStyle, pane: 'borderPane' }).addTo(map3);
            const heatPoints = incidentsData.features.map(feature => [feature.geometry.coordinates[1], feature.geometry.coordinates[0], 0.5]);
            L.heatLayer(heatPoints, {
                radius: 20, blur: 30, maxZoom: 12, gradient: {0.4: '#fdbe85', 0.7: '#fd8d3c', 1: '#e6550d'}
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
            const numA = parseFloat(String(valA).replace(/[^0-9.-]+/g, ''));
            const numB = parseFloat(String(valB).replace(/[^0-9.-]+/g, ''));

            if (!isNaN(numA) && !isNaN(numB)) {
                return state.sortDirection === 'asc' ? numA - numB : numB - numA;
            }
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
    
    // --- NEW VISUALIZATIONS: Treemap and Sankey ---
    function renderTreemap() {
        const treemapSvg = d3.select("#treemap-chart");
        const treemapNode = treemapSvg.node();
        if (!treemapNode) return;

        treemapSvg.selectAll("*").remove();
        const { width, height } = treemapNode.getBoundingClientRect();

        const counts = d3.rollup(tableData, v => v.length, d => d.job_family);
        const hierarchyData = { name: "root", children: Array.from(counts, ([key, value]) => ({ name: key, value })) };
        
        const root = d3.hierarchy(hierarchyData).sum(d => d.value);

        d3.treemap().size([width, height]).padding(2)(root);
        
        const color = d3.scaleOrdinal(d3.schemeTableau10);

        const cell = treemapSvg.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        cell.append("rect")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => color(d.data.name))
            .on("mouseover", (event, d) => tooltip.style("opacity", 1).html(`<b>${d.data.name}</b><br>${d.data.value} employees`))
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => tooltip.style("opacity", 0));

        cell.append("text")
            .selectAll("tspan")
            .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
            .join("tspan")
            .attr("x", 4)
            .attr("y", (d, i) => 14 + i * 12)
            .text(d => d)
            .attr("class", "text-xs font-semibold fill-white pointer-events-none");
            
        cell.append("text")
             .attr("x", 4)
             .attr("y", d => (d.y1 - d.y0) - 5)
             .text(d => d.data.value)
             .attr("class", "text-lg font-bold fill-white pointer-events-none");
    }

    function renderSankey() {
        if (typeof d3.sankey !== 'function') {
            console.error("d3-sankey library is not loaded. Please add it to your HTML file.");
            d3.select("#sankey-chart").append("text")
              .attr("x", 20).attr("y", 40)
              .attr("class", "fill-red-500")
              .text("Error: d3-sankey.js is missing.");
            return;
        }

        const sankeySvg = d3.select("#sankey-chart");
        const sankeyNode = sankeySvg.node();
        if (!sankeyNode) return;

        sankeySvg.selectAll("*").remove();
        const { width, height } = sankeyNode.getBoundingClientRect();
        
        const links = [];
        const countryToFamily = new Map();
        const familyToPosition = new Map();

        tableData.forEach(d => {
            const countryFamilyKey = `${d.country}\0${d.job_family}`;
            countryToFamily.set(countryFamilyKey, (countryToFamily.get(countryFamilyKey) || 0) + 1);

            const familyPosKey = `${d.job_family}\0${d.position}`;
            familyToPosition.set(familyPosKey, (familyToPosition.get(familyPosKey) || 0) + 1);
        });

        countryToFamily.forEach((value, key) => {
            const [source, target] = key.split("\0");
            links.push({ source, target, value });
        });
        familyToPosition.forEach((value, key) => {
            const [source, target] = key.split("\0");
            links.push({ source, target, value });
        });

        const nodeNames = Array.from(new Set(links.flatMap(l => [l.source, l.target])));
        const graph = {
            nodes: nodeNames.map(name => ({ name })),
            links: links.map(({ source, target, value }) => ({
                source: nodeNames.indexOf(source),
                target: nodeNames.indexOf(target),
                value
            }))
        };
        
        const sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 5], [width - 1, height - 5]]);

        const {nodes: layoutNodes, links: layoutLinks} = sankey(graph);

        const color = d3.scaleOrdinal(d3.schemeTableau10);

        const link = sankeySvg.append("g")
            .attr("fill", "none")
            .selectAll("g")
            .data(layoutLinks)
            .join("g")
            .attr("stroke-opacity", 0.5)
            .on("mouseover", function() { d3.select(this).attr("stroke-opacity", 0.7); })
            .on("mouseout", function() { d3.select(this).attr("stroke-opacity", 0.5); })
            .on("mousemove", (event, d) => {
                tooltip.style("opacity", 1)
                       .html(`<b>Flow:</b> ${d.source.name} → ${d.target.name}<br><b>Employees:</b> ${d.value}`)
                       .style("left", (event.pageX + 15) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", () => tooltip.style("opacity", 0));
        
        const gradient = link.append("linearGradient")
            .attr("id", (d,i) => `gradient-${i}`)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", d => d.source.x1)
            .attr("x2", d => d.target.x0);

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", d => color(d.source.name.split(" ")[0]));

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", d => color(d.target.name.split(" ")[0]));

        link.append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", (d,i) => `url(#gradient-${i})`)
            .attr("stroke-width", d => Math.max(1, d.width));
        
        const node = sankeySvg.append("g")
            .selectAll("g")
            .data(layoutNodes)
            .join("g");

        node.append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => color(d.name.split(" ")[0]))
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1).html(`<b>${d.name}</b><br>${d.value} employees`);
                link.attr('stroke-opacity', l => l.source === d || l.target === d ? 0.7 : 0.2);
            })
            .on("mousemove", (event) => tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 28) + "px"))
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
                link.attr('stroke-opacity', 0.5);
            });
        
        node.append("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .attr("class", "text-xs fill-gray-300 pointer-events-none")
            .text(d => d.name);
    }
    
    function initNewCharts() {
        renderTreemap();
        renderSankey();
        
        const newVizContainer = document.getElementById('new-viz-section');
        if(newVizContainer){
            new ResizeObserver(() => {
                renderTreemap();
                renderSankey();
            }).observe(newVizContainer);
        }
    }

    // --- INITIALIZE EVERYTHING ---
    calculateAndUpdateKPIs();
    setupControls();
    renderTable();
    initEmployeeMap();
    initIncidentMaps();
    initNewCharts();
});
