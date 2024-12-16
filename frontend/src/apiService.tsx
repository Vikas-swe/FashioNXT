import { BASE_URL } from "./constants";

export async function fetchUserData(userId){
    try{
        const response = await fetch(`${BASE_URL}/matrix/users?userID=${userId}`);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data || [];
    }
    catch(err){
        console.log(err);
    }
}

export async function fetchProducts(){
    try{
        const response = await fetch(`${BASE_URL}/products`);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data || [];
    }
    catch(err){
        console.log(err);
    }
}

export async function fetchProductsById(id){
    try{
        const response = await fetch(`${BASE_URL}/products/${id}`);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data?.[0] || [];
    }
    catch(err){
        console.log(err);
    }
}
export async function sendUserPreferenceAI(prompt,userId) {
    const url = BASE_URL + '/matrix/userPreference?ai=true';
    const data = {
      prompt: prompt,
      userID: userId,
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const responseData = await res.json();
        return responseData;
    } catch (err) {
        console.log(err);
    }
  };


export const sendUserPreference = async (reqData,userId) => {
    const url = `${BASE_URL}/matrix/userPreference`;
    const data = {
        ...reqData,
        userID: userId
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const responseData = await res.json();
        return responseData;
    } catch (err) {
        console.log(err);}
  };