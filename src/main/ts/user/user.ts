import {Serializable} from "../serializable";
import {Role} from "./role";

export class User extends Serializable {
    constructor(public id: number, public firstName: string, public lastName: string, public username: string, public email: string, public roles: Role[]) {
        super();
    }

    public hasRole(roleName: String): boolean {
        let hasRole: boolean = false;

        for (let role of this.roles) {
            hasRole = (role.name == roleName || hasRole);
        }

        return hasRole;
    }
}