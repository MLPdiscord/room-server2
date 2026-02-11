import { createSocket } from "dgram";

const server = createSocket("udp4");

const rooms = {};

server.on("error", error => {
    console.error(error);
})

server.on("message", (msg, rinfo) => {
    msg = "" + msg;
    console.log(msg, rinfo.address, rinfo.family, rinfo.port, rinfo.size);
    
    if (msg in rooms) {
        const room = rooms[msg];
        room[rinfo.address] = rinfo.port;

        const answer = [];
        for (const address in room) {
            if (address !== rinfo.address) {
                answer.push(`${address}:${room[address]}`);
            }
        }

        server.send(answer.join("\n"));
    } else {
        rooms[msg] = {}
        rooms[msg][rinfo.address] = rinfo.port;

        server.send("[]", rinfo.port, rinfo.address);
    }
})

server.bind(6969);
