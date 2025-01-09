

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
        this.UTCSecBAR = 0.00024306
        this.highPorog = 9.3
        this.lowPorog = 8.5
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
        this.flagLowpressure = false
        this.indexTyres = {}
        this.swap = [8.6, 9.2]
        this.flagstartReys = false
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
            this.installStateTravel(tyres, index)
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
        this.data.forEach((tyres, indx) => {
            this.step = this.randomStep(vector.arrayStep)
            const ind = index - 1
            this.mutationValue = this.getMutationValue(tyres.val[ind], tyres.val[index].dates, this.celevoy, this.step, indx)
            tyres.val[index].value = this.mutationValue
            tyres.val[index].state = this.stateTravel === 1 ? 'рейс' : 'парковка'
            tyres.val[index].cube = this.stateCube

        })
    }

    getMutationValue(tyres, timevalue, celevoy, step, indx) {
        const value = tyres.value
        let mutationValue;
        if (this.stateTravel === 1) {
            if (tyres.state === 'парковка') {
                mutationValue = value <= this.lowPorog ? (Math.random() * (this.swap[1] - this.swap[0]) + this.swap[0]) :
                    value
            }
            else {
                if (this.flagMutation) {
                    if (value < celevoy) {
                        mutationValue = (value + step) > celevoy ? value : value + step;
                    } else if (value > celevoy) {
                        mutationValue = (value - step) < celevoy ? value : value - step;
                    } else {
                        mutationValue = value;
                    }
                } else {
                    this.randomCube()
                    mutationValue = value;
                }
            }

        } else {
            mutationValue = this.lowDinalicalPressureParking(value, timevalue, tyres, indx)
        }
        return parseFloat(mutationValue.toFixed(1))
    }

    lowDinalicalPressureParking(value, timevalue, tyres, indx) {
        const timenow = Math.floor(new Date(timevalue).getTime() / 1000)
        const timeold = Math.floor(new Date(tyres.dates).getTime() / 1000)
        const step = this.UTCSecBAR * (timenow - timeold)
        let newValue;
        if (this.indexTyres[indx] && value > 9) {
            newValue = value - step < 9 ? 9 : value - step
        }
        else {
            newValue = value
        }
        return newValue
    }


    mutationFirstMsg(index) {
        this.data.forEach(tyres => {
            const randomValue = this.randomPressureToDiapazon(index)
            tyres.val[index].value = randomValue
            tyres.val[index].state = this.stateTravel === 1 ? 'рейс' : 'парковка'
        })
    }

    installStateTravel(msg, index) {
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
                this.flagLowpressure = false
                this.timeParking = 0;
                this.lastParkingTime = null
                if (!this.flagLowpressure) {
                    this.data.forEach((it, indexTyres) => {
                        it.val[index - 1].value >= 9.3 ? this.indexTyres[indexTyres] = true : this.indexTyres[indexTyres] = false
                    })
                    this.flagLowpressure = true
                }

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
        const keys = Object.keys(this.diapazonsState);
        const randomIndex = Math.floor(Math.random() * keys.length);
        this.stateCube = keys[randomIndex]
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