function MutationError(e){
    if (e === "Error: GraphQL error: jwt expired") {
        localStorage.removeItem("userinfo");
        document.getElementById("hidelogin").click();
    }
    if (e === "Error: Network error: Failed to fetch") {
        alert("Check your internet connection")
    }
}

export default MutationError;