import React, { useEffect } from "react";
import './App.css';

import Highcharts from "highcharts";
import HighchartsSankey from "highcharts/modules/sankey";
import HighchartsReact from "highcharts-react-official";

import { getData } from './apiUtil.js';

HighchartsSankey(Highcharts);


function App() {
  const [data, setData] = React.useState();
  const [drilldownHistory, setDrilldownHistory] = React.useState({});

  useEffect(() => {
    getData('Sales')
      .then(updateData => {
        setData(updateData['data']);
      });
    getData('Expenses')
      .then(updateData => {
        setData(data => ([...data, ...updateData['data']]));
      });
  }, []);

  const options = { 
    series: [
      {
        point: {
            events: {
                click: function (e) {
                    let series = this.series;
                    if (this.isNode && this.id != undefined) {
                      if (this.id in drilldownHistory) {
                        // user is trying to close the expanded view
                        let drilldownHistoryRemovalKeys = new Set(drilldownCloserHelper(this.id));
                        let newData = [];
                        for (var row in data) { 
                          if (!drilldownHistoryRemovalKeys.has(data[row][0])) {
                            newData.push(data[row]);
                          }
                        }
                        setData(newData);
                        setDrilldownHistory(Object.fromEntries(Object.entries(drilldownHistory).filter(([k,v]) => !drilldownHistoryRemovalKeys.has(k))));
                      }
                      else {
                        getData(this.id)
                          .then((updateData) => {
                            setData(data => ([...data, ...updateData['data']]));
                            series.update({ data: data });
                            setDrilldownHistory(drilldownHistory =>  ({ ...drilldownHistory, [updateData['id']]: updateData['data']}));
                          });
                      }
                    }
                }
            },
            
        },
        keys: ['from', 'to', 'weight', 'hasDrilldown'],
        data: data,
        type: 'sankey',
    }
  ],
  title: {
    text: 'P&L Breakdown'
  },
  };

  // function linksHover(point, state) {
  //   if (point.isNode) {
  //     console.log(point)
  //     point.linksFrom.forEach(function(l) {
  //       l.setState(state);
  //     });
  //   }
  // }

  const drilldownCloserHelper = (id) => {
    let dataToRemove = [];

    if (id in drilldownHistory) {
      dataToRemove.push(id);
      let stack = [id];
      while (stack.length) {
        let node = stack.pop();
        
        for (var i in drilldownHistory[node]) {
          let child = drilldownHistory[node][i][1];
          stack.push(child); // "to" field, find its viewable subchildren
          dataToRemove.push(child);
        }
      };
    }
    
    return dataToRemove;
  };

  return (
    <div className="App">
      {data && <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />}
    </div>
  );
}

export default App;
