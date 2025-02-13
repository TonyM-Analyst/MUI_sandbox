// data handler function to retrieve dad jokes from api and export it

export async function fetchDadJokes() {
    try {
        const response = await fetch('https://dad-jokes-api1.p.rapidapi.com/dad_jokes', {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'd9aef98ee7msh8e588dd4af72048p140048jsnfb9b03e4a70c',
                'x-rapidapi-host': 'dad-jokes-api1.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dad jokes:', error);
        return null;
    }
};