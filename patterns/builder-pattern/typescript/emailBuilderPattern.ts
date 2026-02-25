// DESGIN THE EMAIL BUILDER

class Email{
    readonly toEmail: string;
    readonly subject: string
    readonly cc : string[];
    readonly bcc : string[];
    readonly body : string;
    readonly priority : string;
    readonly attachment : string[];

    private constructor(builder : InstanceType<typeof EmailBuilder>){
        this.toEmail = builder.toAddr;
        this.subject  = builder.subjectContent;
        this.cc  = builder.ccAddr;
        this.bcc  = builder.bccAddr;
        this.body  = builder.bodyContent;
        this.priority  = builder.priorityContent;
        this.attachment  = builder.attachmentContent;
    }

    toString(){
        return `To: ${this.toEmail} \nSubject: ${this.subject} \nCC: ${this.cc} \nBCC: ${this.bcc} \nBody: ${this.body} \nPriority: ${this.priority} \nAttachment: ${this.attachment}`;
    }

    static get getBuilder(){
        return EmailBuilder;
    }
}

class EmailBuilder{
      toAddr: string;
      subjectContent: string
      ccAddr : string[] = [];
      bccAddr : string[] = [];
      bodyContent : string = "";
      priorityContent : string = "Normal";
      attachmentContent : string[] = [];

      constructor(to : string, subject : string){
           this.toAddr = to;
           this.subjectContent = subject;
      }

      setCc(cc : string[]){
        this.ccAddr = [...cc];
        return this;
      }

        setBcc(bcc : string[]){
        this.bccAddr = [...bcc];
        return this;
      }

      setBody(body : string){
        this.bodyContent = body;
        return this;
      }

        setPriority(priority : string){
        this.priorityContent = priority;
        return this;
        }

        setAttachement(attachment : string[]){
        this.attachmentContent = [...attachment];
        return this;
      }

      build() : Email{
        return new (Email as any)(this);
      }
}

const email1 = new EmailBuilder("alice@example.com", "Meeting Tomorrow")
.setBody("Hi Alice, just a reminder about our meeting tomorrow at 10 AM.")
.setCc(["admin@example.com"])
.build();

const email2 = new EmailBuilder("alice@example.com", "Meeting Tomorrow")
.setBody("Hi Alice, just a reminder about our meeting tomorrow at 10 PM.")
.setCc(["admin@example.com"])
.setBcc(["admin2@example.com"])
.setAttachement(["agenda.pdf"])
.setPriority("High")
.build();
console.log(email1.toString());
console.log("\n");
console.log(email2.toString());