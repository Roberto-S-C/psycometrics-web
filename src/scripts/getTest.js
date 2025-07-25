const getTest = async (candidate_id) => {
    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/tests/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ candidate_id }),
        }
    );
    if (!response.ok) {
        console.error("Error fetching test data:", response.status, response.statusText);
        return null;
    }

    const data = await response.json();
    return data;
};

export default getTest;