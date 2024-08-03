interface IProductMiddle{
    productVerify?(name: string, qtd: number, value: number): string | boolean
}

export class productMiddle implements IProductMiddle {
    public static productVerify(name: string, qtd: number, value: number){
        if(name === null || qtd === null || value === null){
            return 'não deixe campos em branco!'
        }

        if(name === undefined || qtd === undefined || value === undefined){
            return 'não deixe campos em branco!'
        }

        if(name.length < 3){
            return 'O produto precisa ter nome com mais de 3 caracter.';
        }

        if(qtd < 0 && value < 0){
            return 'inválido, coloque um numéro igual ou superior a 0';
        }

        
        return true
    }
}