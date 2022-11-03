const {
    Extension,
    type,
    api,
} = require('clipcc-extension');

window.httpCode = ''
window.netErr = false
window.httpTimeout = 30000

class MyExtension extends Extension {
    onInit() {
        api.addCategory({
            categoryId: 'awablack.httpio_plus.category',
            messageId: 'awablack.httpio_plus.category',
            color: '#328f9f'
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.get',
            type: type.BlockType.REPORTER,
            messageId: 'awablack.httpio_plus.get',
            categoryId: 'awablack.httpio_plus.category',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'https://api.codingclip.com/v1/project/getDetail?id=1'
                }
            },
            function: args => this.return(this.http('get', args.VALUE, ''))
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.post',
            type: type.BlockType.REPORTER,
            messageId: 'awablack.httpio_plus.post',
            categoryId: 'awablack.httpio_plus.category',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,

                    default: 'https://httpbin.org/anything'
                },
                VALUE2: {
                    type: type.ParameterType.STRING,
                    default: '{"key": "value"}'
                }
            },
            function: args => this.return(this.http('post', args.VALUE, args.VALUE2))
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.put',
            type: type.BlockType.REPORTER,
            messageId: 'awablack.httpio_plus.put',
            categoryId: 'awablack.httpio_plus.category',
            param: {
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'https://httpbin.org/anything'
                },
                VALUE2: {
                    type: type.ParameterType.STRING,
                    default: '{"key": "value"}'
                }
            },
            function: args => this.return(this.http('post', args.VALUE, args.VALUE2))
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.ohterReq',

            type: type.BlockType.REPORTER,
            messageId: 'awablack.httpio_plus.ohterReq',
            categoryId: 'awablack.httpio_plus.category',
            param: {
                TYPE: {
                    type: type.ParameterType.STRING,
                    menu: this.makeMenus('awablack.betterhttpio.ohterReq.type', ['HEAD', 'OPTIONS', 'DELETE']),
                    default: 'HEAD'
                },
                VALUE: {
                    type: type.ParameterType.STRING,
                    default: 'https://httpbin.org/anything'
                }
            },
            function: args => this.return(this.http(args.TYPE, args.VALUE))
        });
        api.addBlock({

            messageId: 'awablack.httpio_plus.httpCode',
            categoryId: 'awablack.httpio_plus.category',
            function: () => this.return(httpCode)
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.networkError',
            type: type.BlockType.BOOLEAN,
            messageId: 'awablack.httpio_plus.networkError',
            categoryId: 'awablack.httpio_plus.category',
            function: () => this.return(netErr)
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.httpCode',
            type: type.BlockType.REPORTER,
            messageId: 'awablack.httpio_plus.httpCode',
            categoryId: 'awablack.httpio_plus.category',
            function: () => this.return(httpCode)
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.networkError',
            type: type.BlockType.BOOLEAN,
            messageId: 'awablack.httpio_plus.networkError',
            categoryId: 'awablack.httpio_plus.category',
            function: () => this.return(netErr)
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.setTimeout',
            type: type.BlockType.COMMAND,
            messageId: 'awablack.httpio_plus.setTimeout',
            categoryId: 'awablack.httpio_plus.category',
            param: {
                VALUE: {
                    type: type.ParameterType.NUMBER,
                    default: '30000'
                }
            },
            function: args => this.setHttpTimeout(args.VALUE)
        });
        api.addBlock({
            opcode: 'awablack.httpio_plus.timeout',
            type: type.BlockType.REPORTER,
            messageId: 'awablack.httpio_plus.timeout',
            categoryId: 'awablack.httpio_plus.category',
            function: () => this.return(httpTimeout)
        });

    }
    onUninit() {
        api.removeCategory('awablack.httpio_plus.category');
    }
    return(VALUE) {
        return VALUE;
    }
    setHttpTimeout(time) {
        window.httpTimeout = Number(time)
    }
    makeMenus(block, menus) {
        const menu = [];
        for (const item of menus) {
            menu.push({
                messageId: `${block}.menu.${item}`,
                value: item
            });
        }
        return menu;
    }
    http(type, url, json) {

        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.timeout = window.httpTimeout
            if (type == 'post') {
                req.open('post', url);
                req.send(json)
            } else if (type == 'put') {
                req.open('PUT', url)
                req.send(json);
            } else {
                req.open(type, url);
                req.send();
            }
            req.onload = function () {
                window.httpCode = req.status
                window.netErr = false
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    resolve(req.response);
                }
            };
            req.onerror = function () {
                window.httpCode = ''
                window.netErr = true
                resolve("");
            };
        });
    }
}

module.exports = MyExtension;
