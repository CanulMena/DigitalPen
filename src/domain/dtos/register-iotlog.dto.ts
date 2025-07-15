
export class RegisterIoTLogDto{
  constructor(
    public userId: number, // El ID del usuario que registra el log IoT
    public date: Date,
    public temperature: number,
    public humidity: number,
  ){}

  static create( props: {[key: string]: any} ): [string?, RegisterIoTLogDto?] {
    const { userId, date, temperature, humidity } = props;

    if (!userId) return ['Missing userId'];
    if (typeof userId !== 'number') return ['userId must be a number'];

    if (!date) return ['Missing date'];
    const newDate = new Date(date);
    if (isNaN(newDate.getTime())) return ['date is not a valid date - format: yyyy-mm-dd hh:mm:ss'];

    if (typeof temperature !== 'number') return ['temperature must be a number'];

    if (typeof humidity !== 'number') return ['humidity must be a number'];

    return [undefined, new RegisterIoTLogDto(userId, newDate, temperature, humidity)];
  }
}