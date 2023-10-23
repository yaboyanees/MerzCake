# Introduction to MerzCake Data Visualization Technique
MerzCake takes its inspiration from the stacked column chart and a pie chart to create another interesting view of the dataset. 
<img width="600" alt="image" src="https://github.com/yaboyanees/MerzCake/assets/498666/0d92d424-2cc0-4b05-b5c1-d1ffd1d05ceb">

The cool features that I like from this data visualization that are hard in other visualizations is the ability to:
- 🌐 Spatially arrange the nodes, which is great for GIS applications
- ↔️ Dynamic Sizing of nodes based on the total of each layer of the cake
- 🕸️ Show a central node that is sized according to all the contributing node sizes at each layer 

## Milestone Tracking
- [x] Write the readme content
- [x] Refactor the code to be accept dynamic inputs
- [ ] Rewrite the height calculation of each section to take into account the area
- [ ] Get this to a point where others would love to use in their projects
- [ ] Make it into some data visualization library like d3.js, powerBI, tableau, excel, etc.

## How it works?
This visualization uses the HTML <canvas> element to draw the node graphics, on the fly, with JavaScript. My somewhat faulty approach to solving this challenge was to:
1. draw each node as a stacked column comprised of different sections
2. set the width equal to the height so I can have each node as a square
3. clip the square by using radius (height/2) to make a circle
4. draw a dotted line from all nodes to a central node

## Getting Started
1. Download 
2. Second item
3. Third item

## How can I help?
I welcome any and all feedback to make this better. I am not a developer and like to stay more on the idea / product side of things. I just couldn't find anyone that wanted to do this project with me so I did it myself with lots of back and forth with chatGPT and stackoverflow.
