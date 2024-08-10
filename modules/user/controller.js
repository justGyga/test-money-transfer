import autoBind from "auto-bind";

class UserController {
    #service;
    constructor(){
        autoBind(this)
    }
}