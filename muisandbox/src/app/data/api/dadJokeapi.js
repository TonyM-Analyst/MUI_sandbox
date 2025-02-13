// data handler function to retrieve dad jokes from api and export it

// data handler function to retrieve dad jokes from 9GAG API
export async function fetchDadJokes(after = 5) {
    try {
        const url = `https://programmer-humor.p.rapidapi.com/api/9gag?sorting=hot&after=${after}`;
        const options = {
            method: "GET",
            headers: {
                "x-rapidapi-key": "d9aef98ee7msh8e588dd4af72048p140048jsnfb9b03e4a70c",
                "x-rapidapi-host": "programmer-humor.p.rapidapi.com",
            },
        };

        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        return result; // Ensure JSON is returned
    } catch (error) {
        console.error("Error fetching jokes:", error);
        return []; // Return empty array on failure
    }
}


// export async function fetchDadJokes() {
//     try {
//         const url = 'https://programmer-humor.p.rapidapi.com/api/9gag?sorting=hot&after=5';
//         const options = {
// 	        method: 'GET',
// 	        headers: {
// 		    'x-rapidapi-key': 'd9aef98ee7msh8e588dd4af72048p140048jsnfb9b03e4a70c',
// 		    'x-rapidapi-host': 'programmer-humor.p.rapidapi.com'
// 	    }
//     };

//     const response = await fetch(url, options);
// 	const result = await response.text();
// 	console.log(result);
//     } catch (error) {
//         console.error('Error fetching jokes:', error);
//         return 'Oops! No joke available right now. 🤷‍♂️';
//     }
// }
