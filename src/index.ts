import { 
    KafkaController, 
    Consume, 
    Message, 
    connectKafka, 
    KafkaProducerManager, 
    KafkaProducer, 
    DoneFunc
} from '@piros/kafka';


@KafkaController()
export class Prueba {

    private producer: KafkaProducer;

    constructor(private kafkaProducerManager: KafkaProducerManager) {
        this.kafkaProducerManager.getProducer('localhost:9092').subscribe(producer => this.producer = producer);


        setInterval(() => {
            const message = `The number generated is: ${Math.round(Math.random() * 1000)}`;
            this.producer.send('test', message).subscribe(result => {
                console.log(result);
            });
        }, 1000);


    }

    @Consume('localhost:9092', 'test', 'grupo-1')
    public consume(message: Message, done: DoneFunc): void {
        console.log('Received message', message);
        done((err, data) => {
            console.log('commited');
        });
    }

}


connectKafka();