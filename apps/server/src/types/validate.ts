export interface IValidator<T> {
  handle(): Promise<T>;
}
