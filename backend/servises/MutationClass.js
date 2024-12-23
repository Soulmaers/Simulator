

class MutationClass {
    constructor(inputsData, data) {
        this.low = inputsData.low
        this.normal = inputsData.normal
        this.high = inputsData.high
        this.diapazonsState = {
            'low': inputsData.low,
            'normal': inputsData.normal,
            'high': inputsData.high
        }
        this.timeDiff = Number(inputsData.timeDiff) //время определеия парковки
        this.data = data //массив с данными
        this.defaultStateCube = this.diapazonsState['normal']//стартовый диапазон для первого сообщения
        this.stateCube = null //состояние кубика
        this.prevStateCube = 'normal' //предыдущее состояние кубика
        this.stateTravel = 1 //состояние объекта (рейс или парковка 1-рейс 0-парковка
        this.timeParking = 0; //время рейса с выкл двигателем 
        this.lastParkingTime = null;//предыдущее время сообщения
        this.flagMutation = false
        this.timeMsg = 0;
        this.lastTimeMsg = null;
    }

    init() {
        this.processTemplate()
        this.process()
    }

    process() {
        this.randomCube()
        this.iteration()
    }

    iteration() {
        this.data[0].val.forEach((tyres, index) => {
            this.installStateMsg(tyres)
            this.installStateTravel(tyres)
            if (index === 0) { this.mutationFirstMsg(index) }
            else this.mutation(index)
        })
    }


    installStateMsg(msg) {
        const currentTime = Math.floor(new Date(msg.dates).getTime() / 1000);
        if (this.timeMsg >= this.timeDiff) {
            this.flagMutation = true
            this.timeMsg = 0
            this.lastTimeMsg = null;
        }
        else {
            if (!this.lastTimeMsg) this.lastTimeMsg = currentTime
            else {
                this.timeMsg += currentTime - this.lastTimeMsg
                this.lastTimeMsg = currentTime
            }
            this.flagMutation = false
        }
    }
    mutation(index) {
        const vector = this.stor[`${this.prevStateCube}${this.stateCube}`]
        this.celevoy = vector.celevoy
        this.data.forEach(tyres => {
            this.step = this.randomStep(vector.arrayStep)
            const ind = index - 1
            this.mutationValue = this.getMutationValue(tyres.val[ind].value, this.celevoy, this.step)
            tyres.val[index].value = this.mutationValue
            tyres.val[index].state = this.stateTravel === 1 ? 'рейс' : 'парковка'
        })

    }

    getMutationValue(value, celevoy, step) {

        let mutationValue;
        if (this.stateTravel === 1) {
            if (this.flagMutation) {
                if (value < celevoy) {
                    mutationValue = (value + step) > celevoy ? value : value + step;
                } else if (value > celevoy) {
                    mutationValue = (value - step) < celevoy ? value : value - step;
                } else {
                    mutationValue = value;
                }
            } else {
                mutationValue = value;
            }
        } else {
            mutationValue = value;
        }
        return parseFloat(mutationValue.toFixed(1))
    }


    mutationFirstMsg(index) {
        this.data.forEach(tyres => {
            const randomValue = this.randomPressureToDiapazon(index)
            tyres.val[index].value = randomValue
            tyres.val[index].state = this.stateTravel === 1 ? 'рейс' : 'парковка'
        })
    }

    installStateTravel(msg) {
        const currentTime = Math.floor(new Date(msg.dates).getTime() / 1000);
        if (msg.stop === 0) {
            if (!this.lastParkingTime) {
                this.lastParkingTime = currentTime
            } else {
                this.timeParking += currentTime - this.lastParkingTime
                this.lastParkingTime = currentTime
            }
            if (this.timeParking >= this.timeDiff) {
                this.stateTravel = 0;
                this.timeParking = 0;
                this.lastParkingTime = null
            }
        } else {
            if (this.stateTravel === 0) {
                this.randomCube()
            }
            this.timeParking = 0;
            this.lastParkingTime = null
            this.stateTravel = 1

        }
    }

    randomPressureToDiapazon() {
        const low = parseFloat(this.defaultStateCube[0])
        const high = parseFloat(this.defaultStateCube[1])
        const value = Math.random() * (high - low) + low
        const roundedNumber = parseFloat(value.toFixed(1));
        return roundedNumber
    }
    randomCube() {
        if (this.stateCube) {
            this.prevStateCube = this.stateCube

        }
        //   console.log('бросаем кубик')
        const keys = Object.keys(this.diapazonsState);
        const randomIndex = Math.floor(Math.random() * keys.length);
        this.stateCube = keys[randomIndex]
        // console.log(this.stateCube)
    }

    randomStep(array) {
        const step = Math.floor(Math.random() * array.length)
        return array[step]
    }
    processTemplate() {
        this.stor = {
            'normallow': { celevoy: Number(this.diapazonsState['low'][0]), arrayStep: [0.1, 0.2, 0.3] },
            'normalnormal': { celevoy: 9, arrayStep: [0.1] },
            'normalhigh': { celevoy: Number(this.diapazonsState['high'][1]), arrayStep: [0.1, 0.2] },
            'lowlow': { celevoy: Number(this.diapazonsState['low'][0]), arrayStep: [0.1, 0.2, 0.3] },
            'lownormal': { celevoy: 9, arrayStep: [0.1, 0.2] },
            'lowhigh': { celevoy: Number(this.diapazonsState['high'][1]), arrayStep: [0.1, 0.2] },
            'highlow': { celevoy: Number(this.diapazonsState['low'][0]), arrayStep: [0.1, 0.2, 0.3] },
            'highnormal': { celevoy: 9, arrayStep: [0.1, 0.2, 0.3] },
            'highhigh': { celevoy: Number(this.diapazonsState['high'][1]), arrayStep: [0.1, 0.2] },
        }
    }

}

module.exports = MutationClass