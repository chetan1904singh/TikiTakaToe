import playerMap from "./playerMap.js";

export function validateAnswer(answer, criteria) {

    const player = playerMap.get(answer.toLowerCase());
    console.log(player);
    console.log(criteria);

    if (!player)
        return false;

    return criteria.every(req => {

        switch(req.type){

            case "club":
                return player.clubs.includes(req.value);

            case "country":
                return player.nationality === req.value;

            case "competition":
                return player.competitions.includes(req.value);

            default:
                return false;
        }

    });

}