class Interpreter {
    constructor() {
        this.variables = {};
        this.functions = {};
        this.currentScope = [];
    }

    interpret(code) {
        const lines = code.split('\n');
        let i = 0;
        
        while (i < lines.length) {
            let line = lines[i].trim();            
            
            if (line.endsWith(';')) {
                line = line.slice(0, -1).trim();
            }
            
            if (line === '') {
                i++;
                continue;
            }

            if (line.includes('talalero tralala ->')) {
                const value = this.extractValue(line);
                console.log(this.evaluateValue(value));
            }
            
            else if (line.startsWith('italianaAi')) {
                const funcName = line.match(/italianaAi\s+(\w+)\(\)/)[1];
                let funcBody = [];
                i++;
                
                while (i < lines.length && !lines[i].trim().replace(';', '').includes('brain')) {
                    funcBody.push(lines[i]);
                    i++;
                }
                
                this.functions[funcName] = funcBody;
            }
            
            else if (line.startsWith('Frulli Frulla ->')) {
                const parts = line.split('->');
                const varName = parts[1].trim();
                const value = this.evaluateValue(parts.slice(2).join('->').trim());
                this.variables[varName] = value;
            }
            
            else if (line.startsWith('Trulimero Trulicina')) {
                const condition = line.split('Trulimero Trulicina')[1].trim();
                let ifBlock = [];
                let elseBlock = [];
                let inElse = false;
                i++;
                
                while (i < lines.length && !lines[i].trim().replace(';', '').includes('brain')) {
                    const currentLine = lines[i].trim();
                    if (currentLine.replace(';', '').includes('Frigo Camello')) {
                        inElse = true;
                    } else if (currentLine !== '') {
                        if (inElse) {
                            elseBlock.push(lines[i]);
                        } else {
                            ifBlock.push(lines[i]);
                        }
                    }
                    i++;
                }
                
                if (this.evaluateCondition(condition)) {
                    this.interpret(ifBlock.join('\n'));
                } else if (elseBlock.length > 0) {
                    this.interpret(elseBlock.join('\n'));
                }
            }
            
            else if (line.startsWith('Tung Tung Tung Sahur ->')) {
                const condition = line.split('->')[1].trim();
                let whileBlock = [];
                i++;
                
                while (i < lines.length && !lines[i].trim().replace(';', '').includes('brain')) {
                    whileBlock.push(lines[i]);
                    i++;
                }
                
                while (this.evaluateCondition(condition)) {
                    try {
                        this.interpret(whileBlock.join('\n'));
                    } catch (e) {
                        if (e === 'BREAK') break;
                        throw e;
                    }
                }
            }
            
            else if (line.startsWith('Bombombini Gusini')) {
                const condition = line.match(/\((.*)\)/)[1];
                let forBlock = [];
                i++;
                
                while (i < lines.length && !lines[i].trim().replace(';', '').includes('brain')) {
                    forBlock.push(lines[i]);
                    i++;
                }
                
                for (let j = 0; j < parseInt(condition); j++) {
                    this.interpret(forBlock.join('\n'));
                }
            }
            
            else if (line.startsWith('Brr Brr Patapim')) {
                throw 'BREAK';
            }
            
            else if (line.match(/\w+\(\)/)) {
                const funcName = line.match(/(\w+)\(\)/)[1];
                if (this.functions[funcName]) {
                    this.interpret(this.functions[funcName].join('\n'));
                }
            }
            
            else if (line.startsWith('Serpentini Toiletini ->')) {
                const fileName = this.evaluateValue(this.extractValue(line));
                const xhr = new XMLHttpRequest();
                xhr.open('GET', fileName, false);
                xhr.send();
                if (xhr.status === 200) {
                    this.interpret(xhr.responseText);
                }
            }
            
            else if (line.startsWith('Bombardiro Crocodilo ->')) {
                const errorMessage = this.extractValue(line);
                throw new Error(this.evaluateValue(errorMessage));
            }
            
            else if (line.startsWith('Lirili Larila ->')) {
                const returnValue = this.extractValue(line);
                return this.evaluateValue(returnValue);
            }
            
            i++;
        }
    }

    extractValue(line) {
        return line.split('->').slice(1).join('->').trim().replace(';', '');
    }

    evaluateValue(value) {
        if (!value) return null;
        value = value.trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
        }

        if (value.startsWith('[') && value.endsWith(']')) {
            const arrayContent = value.slice(1, -1).trim();
            if (!arrayContent) return [];
            return arrayContent.split(',').map(item => this.evaluateValue(item.trim()));
        }

        if (value.startsWith('{') && value.endsWith('}')) {
            const objContent = value.slice(1, -1).trim();
            if (!objContent) return {};
            
            const obj = {};
            let currentKey = '';
            let currentValue = '';
            let inString = false;
            let inObject = 0;
            let inArray = 0;
            
            for (let i = 0; i < objContent.length; i++) {
                const char = objContent[i];
                
                if (char === '"' && objContent[i-1] !== '\\') {
                    inString = !inString;
                }
                
                if (!inString) {
                    if (char === '{') inObject++;
                    if (char === '}') inObject--;
                    if (char === '[') inArray++;
                    if (char === ']') inArray--;
                }
                
                if (char === ':' && !inString && !inObject && !inArray) {
                    currentKey = currentValue.trim();
                    currentValue = '';
                    continue;
                }
                
                if (char === ',' && !inString && !inObject && !inArray) {
                    obj[this.evaluateValue(currentKey)] = this.evaluateValue(currentValue.trim());
                    currentKey = '';
                    currentValue = '';
                    continue;
                }
                
                currentValue += char;
            }
            
            if (currentKey || currentValue) {
                obj[this.evaluateValue(currentKey)] = this.evaluateValue(currentValue.trim());
            }
            
            return obj;
        }

        if (this.variables[value]) {
            return this.variables[value];
        }

        if (!isNaN(value)) {
            return parseFloat(value);
        }

        return value;
    }

    evaluateCondition(condition) {
        const parts = condition.split(/([><=!]+)/);
        const left = this.evaluateValue(parts[0].trim());
        const right = this.evaluateValue(parts[2].trim());
        const operator = parts[1].trim();

        switch (operator) {
            case '>': return left > right;
            case '<': return left < right;
            case '==': return left == right;
            case '>=': return left >= right;
            case '<=': return left <= right;
            case '!=': return left != right;
            default: return Boolean(condition);
        }
    }
}
