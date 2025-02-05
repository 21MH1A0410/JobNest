import {useState} from 'react';
import {useAuth} from '@clerk/clerk-react';

const useFetch =(cb,options={})=>{
    const [data,setData] = useState(undefined);
    const [loading,setLoading] = useState(null);
    const [error,setError] = useState(null);

    const {getToken} = useAuth();

    const fn = async (...args)=>{
        setLoading(true);
        setError(null);

        try{
            const supabaseAccessToken = await getToken({
                template: "supabase",
            });
            const response = await cb(supabaseAccessToken,options,...args);
            setData(response);
            setError(null);
        }
        catch(err){
            setError(err);
        } finally{
            setLoading(false);
        }
    };
    return {fn,data,loading,error};
};

export default useFetch;