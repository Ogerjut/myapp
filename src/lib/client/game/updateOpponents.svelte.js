
let opponents = $state([])

export const useOpponents = () => { return opponents }

export function resetOpponent(){
    opponents.length = 0
}

export async function fetchOpponents(ids, tableId) {
        if (!ids.length) {
        opponents.length = 0;
        return;
        }

        const res = await fetch(`/table/${tableId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
        });

        if (res.ok) {
        const data = await res.json();
        opponents.length = 0;
        opponents.push(...data)
        } 
    }


