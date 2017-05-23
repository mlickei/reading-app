export class Request {
    public type = "GET";

    constructor(private url, public data) {

    }

    public run():Promise<any> {
        return new Promise<any>((resolve, reject) => {
            $.ajax(this.url, {
                type: this.type,
                data: this.data
            }).done((data) => {
                resolve(data);
            }).fail((data) => {
                reject(data);
            });
        });
    }

    public runGet():Promise<any> {
        this.type = "GET";
        return this.run();
    }

    public runPost():Promise<any> {
        this.type = "POST";
        return this.run();
    }
}

export class Requests {
    private requests:Request[];
    private locked:boolean = false;

    constructor(...requests: Request[]) {
        this.requests = requests;
    }

    public addRequest(request:Request) {
        this.requests.push(request);
    }

    public runAllRequests():Promise<any> {
        this.locked = true;
        const totalRequests = this.requests.length;

        let finished = 0,
            info = {
                failed: [],
                succeed: []
            };

        return new Promise<any>((resolve, reject) => {
            for(let request of this.requests) {
                request.run().then((data) => {
                    finished ++;

                    info.succeed.push({
                        request: request,
                        data: data
                    });

                    if(finished >= totalRequests) {
                        resolve(info);
                    }
                }).catch((data) => {
                    finished ++;

                    info.failed.push({
                        request: request,
                        data: data
                    });

                    if(finished >= totalRequests) {
                        resolve(info);
                    }
                });
            }
        });
    }

    public async runAllRequestsBlocking() {
        let asyncRequests = this.runAllRequests();
        await asyncRequests.then(() => {
            return 1;
        }).catch(() => {
            return -1;
        });
    }
}