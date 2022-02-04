class Cat {
  name: string
  constructor(name: string) {
    this.name = name
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

export class Lion extends Cat {
  speak() {
    super.speak()
    console.log(`${this.name} roars.`)
  }
}
