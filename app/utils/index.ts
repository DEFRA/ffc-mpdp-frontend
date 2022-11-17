import fetch from "node-fetch"

export  async function getBuffer(url1:string){
      const response = await fetch(url1);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
}