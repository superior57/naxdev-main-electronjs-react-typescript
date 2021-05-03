const tcpp = require('tcp-ping');
const { BrowserWindow } = require('electron');

let mainWindow: typeof BrowserWindow | any;

export type PingNode = {
  id: number;
  type: string;
  host: string;
  port: number;
}

const pingNode = async (node: PingNode) => {
  return new Promise((resolve, reject) => {
    const { id, type, host, port } = node;
    tcpp.ping({ address: host, port }, (error: any, data: any) => {
      let nodeStatus = {
        id,
        type,
        alive: false,
        avgMs: 0,
      };
      if (data.avg) {
        nodeStatus = {
          ...nodeStatus,
          alive: true,
          avgMs: data.avg,
        };
      } else {
        nodeStatus = {
          ...nodeStatus,
          alive: false
        };
      }
      resolve(nodeStatus);
    });
  });
};

export const pingNodes = async (nodes: PingNode[]) => {
  mainWindow = mainWindow ? mainWindow : BrowserWindow.getAllWindows()[0];
  let results = [];
  for (let node of nodes) {
    const status = await pingNode(node);
    results.push(status);
  }
  mainWindow.webContents.send('pong', results);
};
