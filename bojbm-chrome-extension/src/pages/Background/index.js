


    
//TODO : 로그인 상태 반환( API에 요청을 보냈을때 만료 401 에러 반환받은 경우 로그아웃 -> if( error.response?.status===401 && error.response?.data.result===="TOKEN INVALID"))


const logoutMessage = ()=>{
    console.log("logoutMessage From background")
    chrome.runtime.sendMessage({action:"logoutInBackground"});
}

const loginMessage = ()=>{
    console.log("loginMessage From background")
    chrome.runtime.sendMessage({action:"loginInBackground"});
}


chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    //로그인
    if (request.action === 'login'){
        console.log("login Listener In Background")
        const {email,password} = request.data
        getAuth(email,password)
        .then((res)=>{ // res는 data를 받아온거 <- res.json()
            console.log(res)
            chrome.storage.sync.set('access-token',res);
            loginMessage();
        })
        .catch((err)=>{
            sendResponse(err.message)
        })
        return true
    }

    if (request.action === "logout"){
        chrome.storage.sync.remove('access-token');
        logoutMessage();
        return true
    }


    //bookmark추가
    if (request.action === 'addBookmark'){
        const {problemId} = request.data
        addBookmark(problemId)
        .then((res)=>{ // res는 data를 받아온거 <- res.json() => 무슨 로직을 더 해줘야하지? -> 
            
            const user = res.result.user
            chrome.storage.sync.set({user})
            sendResponse('')
        })
        .catch((err)=>{
            sendResponse(err.message)
        })
        return true
    }

})

//로그인 요청
const getAuth = async (email,password)=>{
    const settings = {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: { 'Content-Type': 'application/json' }
    }
    try{
        const fetchResponse = await fetch(
            "http://localhost:8080/api/auth/login",
            settings
        )
        const data = await fetchResponse.json()
        return data;
    }catch(err){
        return err
    }
}


// const addBookmark = async(problemId)=>{
//     const settings ={
//         method: 'Post',
//         headers:{
//             'Authorization': "Bearer "+chrome.storage.sync.get("access_token")
//         },
//         body: JSON.stringify({
//             problemId
//         }),
//     }
//     try{
//         const fetchResponse = await fetch(
//             "http://localhost:8080/api/bookmark/add",
//             settings
//         )
//         const data = await fetchResponse.json()
//         return data;
//     }catch(err){
//         return err
//     }
// }


// 다른 js에서 메시지 보내는 방법
// chrome.runtime.sendMessage({
//     method: 'createSuccessProblemTab',
//     asdf: 'asdfjksljfd', ...
//   });





// //send util
// // fetch("http://localhost:8080/~~"),{
// //     method:"post",
// //     headers :{
// //         Authorization : chrome.storage.sync.get("access_token")
// //     }
// // }.then(response=>response.json())
// // .then(response=>{
// //     console.log(response.data);
// // })


// // refresh 토큰 요청
// //const refereshToken =


// //로그인 요청
// const authLogin =async(email,password)=>{
//     const settings = {
//         method: 'POST',
//         // headers:{
//         //     Accept: 'application/json, text/plain, */*',
//         //     'Content-Type' : 'application/json',
//         // },
//         body: JSON.stringify({
//             email,
//             password,
//         }),
//     }
//     try{
//         const fetchResponse = await fetch(
//             "http://localhost:8080/api/auth/authenticate",
//             settings
//         )
//         const data = await fetchResponse.json()
//         return data;
//     }catch(err){
//         return err
//     }
// }


// const getBookmark = async()=>{
//     const settings ={
//         method: 'Get',
//         headers:{
//             'Authorization': "Bearer "+chrome.storage.sync.get("access_token")
//         },
//         body: JSON.stringify({
//             notificationDate
//         }),
//     }
//     try{
//         const fetchResponse = await fetch(
//             "http://localhost:8080/api/bookmark/list",
//             settings
//         )
//         const data = await fetchResponse.json()
//         return data;
//     }catch(err){
//         return err
//     }
// }

// //bookmark 추가 요청 => content_script.js로 옮겨야 할듯 ( bookmark.js )
// const addBookmark = async(problemId)=>{
//     const settings ={
//         method: 'Post',
//         headers:{
//             'Authorization': "Bearer "+chrome.storage.sync.get("access_token")
//         },
//         body: JSON.stringify({
//             problemId
//         }),
//     }
//     try{
//         const fetchResponse = await fetch(
//             "http://localhost:8080/api/bookmark/add",
//             settings
//         )
//         const data = await fetchResponse.json()
//         return data;
//     }catch(err){
//         return err
//     }
// }

// // 크롬 브라우저 시작시 storage 초기화
// chrome.runtime.onStartup.addListener(function(){
//     chrome.storage.sync.clear()
// })

// chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
//     //로그인
//     if (request.action == 'login'){
//         const {email,password} = request.data
//         authLogin(email,password)
//         .then((res)=>{ // res는 data를 받아온거 <- res.json()
//             console.log(res)
//             chrome.storage.sync.set('access-token',res.access_token);
//         })
//         .catch((err)=>{
//             sendResponse(err.message)
//         })
//         return true
//     }

//     //bookmark추가
//     if (request.action == 'addBookmark'){
//         const {problemId} = request.data
//         addBookmark(problemId)
//         .then((res)=>{ // res는 data를 받아온거 <- res.json() => 무슨 로직을 더 해줘야하지? -> 
            
//             const user = res.result.user
//             chrome.storage.sync.set({user})
//             sendResponse('')
//         })
//         .catch((err)=>{
//             sendResponse(err.message)
//         })
//         return true
//     }

// })