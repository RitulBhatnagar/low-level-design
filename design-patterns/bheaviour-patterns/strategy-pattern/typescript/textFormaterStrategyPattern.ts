interface Format{
    format(text : string) : string;
}

class UpperCaseformatter implements Format{


    format(text: string): string {
        return text.toUpperCase();
    }
}

class LowerCaseformatter implements Format{

    format(text: string): string {
        return text.toLowerCase();
    }
}

class TitleCaseformatter implements Format{

    format(text: string): string {
        return text.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
    }
}


class FormatContext{

    constructor(private format: Format){}

    setFormatter(formatStrategy : Format){
       this.format = formatStrategy;
    }

    publishText(text : string){
        console.log(`Formated Text : ${this.format.format(text)}`);
    }
}




const text = new FormatContext(new TitleCaseformatter());
text.publishText("new word");

text.setFormatter(new LowerCaseformatter());
text.publishText("NEW Word");