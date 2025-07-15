export class RegisterGasAlarm {
  constructor(
    public date: Date,
    public gasLevel: number,
    public userId: number,
  ){}

  static create( props: {[key: string]: any} ): [string?, RegisterGasAlarm?] {
    const { date, gasLevel, userId } = props;

    if (!userId) return ['Missing userId'];
    if (typeof userId !== 'number') return ['userId must be a number'];

    if (!date) return ['Missing date'];
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) return ['date is not a valid date - format: yyyy-mm-dd hh:mm:ss'];

    if (typeof gasLevel !== 'number') return ['gasLevel must be a number'];

    return [undefined, new RegisterGasAlarm(newDate, gasLevel, userId)];
  }
}