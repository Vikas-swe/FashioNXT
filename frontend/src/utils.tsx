import { supabase } from "./supabase";

export function logOut(){
    supabase.auth.signOut();
}
export function getFileURL(userId,path){
    return 'https://icowovrhkttxcopizqon.supabase.co/storage/v1/object/public/matrix_public/assets/image/'+userId+'/'+path;
}