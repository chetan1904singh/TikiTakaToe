import {players} from "../data/players.js" 

function normalize(name) {
    return name
        .trim()
        .toLowerCase();
}

const playerMap = new Map();

for (const p of players) {
    playerMap.set(
        normalize(p.name),
        p
    );
}

export default playerMap;

/**
 "lionel messi":{
    name: "Lionel Messi",
    clubs: [...],
    nationality: ...
}
 */