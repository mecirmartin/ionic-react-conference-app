export async function getFilesFromGitlab() {

    var gitLabData: any;

    const endpoint = 'https://gitlab.com/api/v4/projects/21967675/repository/tree?path=githubapi/src/components/'
    await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            cache: 'no-store',
            //Authorization: "Bearer token" 
            //...(headers || window.endpointHeaders)
        }
    })
        .then(res => {
            var responseData;
            res.json().then(data => { gitLabData = data; console.log("DATATA", gitLabData); return gitLabData })
            console.log("RESPONSE", responseData)
            //console.log("RESSSS", response)
            return gitLabData
        })
        .then(data => {

        })
    console.log("DATATA", gitLabData)
    return gitLabData
}

//   const saveToGitlab = async () => {
//     let encoded = btoa(gitlabCode)
//     console.log("Encoded ", encoded)
//     const endpoint = `https://gitlab.com/api/v4/projects/21967675/repository/files/githubapi%2Fsrc%2Fcomponents%2FMessageListItem.tsx?branch=master
//     &commit_message=NewUpdate&content=${encoded}`
//     let dataToSend = { ...dataFromGit, content: encoded, commit_message: "NewUpdate", branch: "master" }
//     await fetch(endpoint, {
//       method: 'PUT',
//       body: JSON.stringify(dataToSend),
//       headers: {
//         'Accept': 'application/json',
//         cache: 'no-store',
//         //Authorization: "Bearer token" 
//         //...(headers || window.endpointHeaders)
//       }
//     })
//       .then(res => {
//         var responseData;
//         console.log("res", res)
//         console.log(res.json())
//         console.log("RESPONSE", responseData)
//         //console.log("RESSSS", response)
//       })
//       .then(data => {

//       })
//   }
//   // const loadFileFromGit = async () => {
//   //   const endpoint = `https://gitlab.com/api/v4/projects/21967675/repository/files/githubapi%2Fsrc%2Fcomponents%2FMessageListItem.tsx?ref=master
//   //   `
//   //   await fetch(endpoint, {
//   //     method: 'GET',
//   //     headers: {
//   //       'Accept': 'application/json',
//   //       cache: 'no-store',
//   //       //Authorization: "Bearer token" 
//   //       //...(headers || window.endpointHeaders)
//   //     }
//   //   })
//   //     .then(res => {
//   //       var responseData;
//   //       console.log("res", res)
//   //       res.json().then(data => { console.log("GITHUBREPOSNE", data); setDataFromGit(data) })

//   //       console.log("RESPONSE", responseData)
//   //       //console.log("RESSSS", response)
//   //     })
//   //     .then(data => {

//   //     })

//   // }



export const loadFile = async (fileName: any) => {
    var dataFromGit
    const endpoint = `https://gitlab.com/api/v4/projects/21967675/repository/files/githubapi%2Fsrc%2Fcomponents%2F${fileName}?ref=master
    `
    await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            cache: 'no-store',
            //Authorization: "Bearer token" 
            //...(headers || window.endpointHeaders)
        }
    })
        .then(res => {
            var responseData;
            console.log("res", res)
            res.json().then(data => { console.log("GITHUBREPOSNE", data); dataFromGit = atob(data.content); })

            console.log("RESPONSE", responseData)
            //console.log("RESSSS", response)
        })
        .then(data => {

        })

    return dataFromGit
}

//   const loadGitlab = async () => {
//     const endpoint = `https://gitlab.com/api/v4/projects/21967675/repository/blobs/${fileId}`
//     await fetch(endpoint, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         cache: 'no-store',
//         //Authorization: "Bearer token" 
//         //...(headers || window.endpointHeaders)
//       }
//     })
//       .then(res => {
//         var responseData;
//         res.json().then(data => { console.log("GITHUBREPOSNE", data); setGithubResponse(data); let resData = atob(data.content); setGitlabcode(resData); console.log("DATATA", gitlabCode) })
//         console.log("RESPONSE", responseData)
//         //console.log("RESSSS", response)
//       })
//       .then(data => {

//       })
//   }