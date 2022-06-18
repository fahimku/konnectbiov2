import Axios from "axios"
import Config from "../config"

const konnect=Axios.create({
    // baseURL:Config.hostApi,
    baseURL:'http://172.16.1.157:9000',
    // baseURL:'https://api.konnect.bio',
    // baseURL:'http://172.16.1.85:9000',
})
export default konnect