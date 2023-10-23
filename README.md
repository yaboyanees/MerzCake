# Introduction to MerzCake Data Visualization Technique
MerzCake offers a new way to convey the 'part-to-whole' relationship within your data, which enabls your audience to easily comprehend how a total amount is distributed across various categories in time and space. MerzCake draws inspiration from stacked column charts and pie charts.

<img width="400" alt="image" src="https://github.com/yaboyanees/MerzCake/assets/498666/0d92d424-2cc0-4b05-b5c1-d1ffd1d05ceb">

The cool features from this data visualization concept is the ability to:
- 🌐 Spatially arrange the nodes, which is great for GIS applications
- ↔️ Dynamic Sizing of nodes based on the total of each layer of the cake
- 🕸️ Show a central node that is sized according to all the contributing node sizes at each layer

## Getting Started
1. Clone / download the code repo OR just the html file
2. set your layer colors for each section that you want represented. Here is an example of 4 layers / categories: `const nodeColors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2'];`
3. define your central node position and size. Here is an example of putting with 4 layers and initialized heights array of 4 zeros: `const centralNode = {x: 400, y: 300, heights: [0, 0, 0, 0]};` *If you have only 3 layers, just make sure to remove one of these zeros and remove one of the colors above.*
4. put your data into this format for each node, where x and y are the position and heights are each section value: `const nodesData = [{ x: 100, y: 100, heights: [20, 15, 15, 5] }];`
5. enjoy another way to view and present your dataset!

## How it works?
This visualization uses the HTML `canvas` element to draw the node graphics, on the fly, with JavaScript. My somewhat faulty approach to solving this challenge was to:
1. draw each node as a stacked column comprised of different sections
2. set the width equal to the height so I can have each node as a square
3. clip the square by using radius (height/2) to make a circle
4. draw a dotted line from all nodes to a central node

## Call 4 Help
I welcome any and all feedback to make this better and more usable. I am not a developer and recognize that there may be better ways to accomplish what I'm envisioning. I couldn't find any developer that was interested to do this project with me so I did it with lots of back and forth between chatGPT and stackoverflow.

## Milestone Tracking
- [x] Write the readme content
- [x] Refactor the code to be accept dynamic inputs
- [ ] Rewrite the height calculation of each section to take into account the area
- [ ] Get this to a point where others would love to use in their projects
- [ ] Make it into some data visualization library like d3.js, powerBI, tableau, excel, etc.
