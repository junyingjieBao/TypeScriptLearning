//控制台UI读入
import { readFileSync } from 'fs';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  

enum Suit
{
    Diamond = 1,
    Club,
    Heart,
    Spade
}

//定义 牌面值的类型别名
type Rank = 
| 'A' | '2' | '3' | '4' | '5' | '6' | '7'
| '8' | '9' | '10' | 'J' | 'Q' | 'K' 

enum cardRank {
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14
}

const rankPoints: { [key:number]: number} = 
{
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 10, 
    12: 10, 
    13: 10,
    14: 11  
}

enum reinforcement
{
    None = "null",
    Rewards = "rewards",
    Multiplier = "multiplier"
}


class handCards
{
    // 表达某一张手牌的两种方式
    // 第一种 通过两个数据，花色和标签
    private _cSuit: Suit;
    private _cRank: cardRank;
    // 第二种仅仅通过一个值
    private _point: number;
    private _cReinforce: reinforcement = reinforcement.None;

    constructor(suit: Suit, rank: cardRank)
    {
        this._cSuit = suit;
        this._cRank = rank;
        this._point = rankPoints[rank];
    }

    get rank(): cardRank
    {
        return this._cRank;
    }

    get suit(): Suit
    {
        return this._cSuit;
    }

    get point(): number
    {
        return this._point;
    }

    get reinforce(): reinforcement
    {
        return this._cReinforce;
    }

}

class CardSender
{   
    // 卡组里的所有手牌
    // 以一个表的方式存储，关键字为某个牌型，值为数量
    handCardsMap: Map<handCards, number> = new Map<handCards, number>();
    // 测试用，手牌数组
    handCardsVec: handCards[] = [];
    
    // 为某一局游戏手牌的发送顺序
    sendOrder: handCards[] = [];
    ptrLoc: number;

    //手牌类共分为两种初始化 
    //构造函数，构造函数为 整局游戏开始时，将手牌初始化为52张。
    constructor()
    {
        console.log("开始创建发牌器");
        // 整局游戏刚刚开始，将牌组初始化为现实手牌
        for(let suit in Suit)
        {
            // for(let rank in cardRank)
            // {
            //     this.handCardsVec.push(new handCards( Number(suit), cardRank[rank] ));
            // }

            //非常丑陋
            if (!isNaN(Number(suit)))
            {
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Ace ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Two ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Three ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Four ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Five ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Six ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Seven ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Eight ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Nine ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Ten ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Jack ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.Queen ));
                this.handCardsVec.push(new handCards( Number(suit), cardRank.King ));
            }
        }

        console.log(this.handCardsVec.length);
        // console.log(this.handCardsVec);
        // 私有成员赋值
        this.ptrLoc = 0;
        
    }


    // 发牌函数，参数为发牌的数量
    // 发牌逻辑，随机生成一个标签，代表要发的牌，并存入一个容器（存储发出去的牌）。需要确保不会重复。
    // 思路：采用Math.random函数, 生成要发的牌，存入临时变量，WARNING：需要确保发出去的牌不会再次被发送。
    // 这是一个比较蠢的思路（太蠢了不高兴写，放弃）
    // 思路2：基于洗牌算法，将现有牌型随机排序，并保存一个指针，记录访问倒了这个数组的哪一个位置

    shuffle()
    {
        //shuffle洗牌算法，该算法下，每张牌选到的概率都是相同的
        for(let i = this.handCardsVec.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [this.handCardsVec[i], this.handCardsVec[j]] = [this.handCardsVec[j], this.handCardsVec[i]];
        }

        // console.log(this.handCardsVec);
        console.log("完成洗牌");
    }

    sendCard(num: number): handCards[]
    {
        let sendingCards: handCards[] = [];
        
        for(let ptr = this.ptrLoc; ptr < this.ptrLoc + num; ++ptr)
        {
            sendingCards.push(this.handCardsVec[ptr]);
        }

        this.ptrLoc += num;
        console.log("本局游戏 locPtr " + this.ptrLoc);
        console.log(sendingCards);
        return sendingCards;
    }

    supplementingCards(supNum: number): handCards[]
    {
        let supplement: handCards[] = [];
        console.log("此时需要补" + supNum);
        console.log("张牌");

        for(let ptr = this.ptrLoc; ptr < this.ptrLoc + supNum; ++ptr)
        {
            supplement.push(this.handCardsVec[ptr]);
        }
        this.ptrLoc += supNum;
        return supplement;
    }

}

class Player
{
    // 玩家手里的手牌
    private playerHandCards: handCards[] = [];

    constructor()
    {
        console.log("你好，玩家");
    }
    
    //玩家获得发牌器发出的牌
    getCardsFromSender(_sendingCards: handCards[]): void 
    {
        // this.playerHandCards = _sendingCards;
        this.playerHandCards.push(..._sendingCards);
    }

    //出牌
    playCards(userInputs: number[]): handCards[]
    {
        let playingCards: handCards[] = [];
        for(let ite of userInputs)
        {
            playingCards.push(this.playerHandCards[ite]);
        }
        console.log("打出的牌为");
        console.log(playingCards);
        console.log("此时玩家手牌为");
        console.log(this.playerHandCards);
        
        for(let i = userInputs.length-1; i > -1; --i)
        {
            this.playerHandCards.splice(userInputs[i], 1);
        }
        console.log("完成删减后，此时玩家手牌为");
        console.log(this.playerHandCards);
        return playingCards;
    }

    //弃牌
    discarding()
    {

    }

    //查看手牌
    disPlayHandCards()
    {
        console.log(this.playerHandCards);
    }

    // 根据点数排序
    sortAccordToRank(): void 
    {
        this.playerHandCards.sort(this.compareCardsRank);
        this.disPlayHandCards();
    }

    // 根据花色排序
    sortAccordToSuit(): void
    {
        this.playerHandCards.sort(this.compareCardsSuit);
        this.disPlayHandCards();
    }

    compareCardsRank(card1: handCards, card2: handCards): number
    {
        let intPart: number = card1.rank - card2.rank;
        let decimalPart: number = 0.1 * (card1.suit - card2.suit);
        return intPart + decimalPart;
    }

    compareCardsSuit(card1: handCards, card2: handCards): number
    {
        let intPart: number = card1.suit - card2.suit;
        let decimalPart: number = 0.1 * ( card1.rank - card2.rank);
        return intPart + decimalPart;
    }

    get handCardsNum(): number
    {
        return this.playerHandCards.length;
    }

}

type chipRatio = [number, number];

class JokerScorePanel
{
    private _checkPointName: string;    // 关卡名
    private _goal: number;              // 目标分数
    private _score: number;             // 获得分数
    private _playingTime: number;       // 出牌机会
    private _discardTime: number;       // 弃牌机会
    private _typeMapForChipRatio: Map<number, chipRatio> = new Map<number, chipRatio>();       //每个牌型的筹码倍率查询表
    
    constructor(checkPointName: string, goal: number, playTime: number, discardTime: number)
    {
        this._checkPointName = checkPointName;
        this._goal = goal;
        this._playingTime = playTime;
        this._discardTime = discardTime;
        this._score = 0;

        for(let typeKey in cardsBrand)
        {
            let type = Number(typeKey);
            if (!isNaN(Number(typeKey)))
                switch(type)
                {
                    case cardsBrand.StraightFlush:
                        let sfcr: chipRatio = [100, 8];
                        this._typeMapForChipRatio.set(cardsBrand.StraightFlush, sfcr);
                        break;
                    case cardsBrand.FourOfAKind:
                        let fkcr: chipRatio = [60, 7];
                        this._typeMapForChipRatio.set(cardsBrand.FourOfAKind, fkcr);
                        break;
                    case cardsBrand.FullHouse:
                        let fhcr: chipRatio = [40, 4];
                        this._typeMapForChipRatio.set(cardsBrand.FullHouse, fhcr);
                        break;
                    case cardsBrand.Flush:
                        let fcr: chipRatio = [35, 4];
                        this._typeMapForChipRatio.set(cardsBrand.Flush, fcr);
                        break;
                    case cardsBrand.Straight:
                        let scr: chipRatio = [30, 4];
                        this._typeMapForChipRatio.set(cardsBrand.Straight, scr);
                        break;
                    case cardsBrand.ThreeOfAKind:
                        let tkcr: chipRatio = [30, 3];
                        this._typeMapForChipRatio.set(cardsBrand.ThreeOfAKind, tkcr);
                        break;
                    case cardsBrand.TwoPairs:
                        let tpcr: chipRatio = [20, 2];
                        this._typeMapForChipRatio.set(cardsBrand.TwoPairs, tpcr);
                        break;
                    case cardsBrand.OnePair:
                        let opcr: chipRatio = [10, 2];
                        this._typeMapForChipRatio.set(cardsBrand.OnePair, opcr);
                        break;
                    case cardsBrand.HighCard:
                        let hccr: chipRatio = [5, 1];
                        this._typeMapForChipRatio.set(cardsBrand.HighCard, hccr);
                }

        }

        console.log(this._typeMapForChipRatio);

    }

    // 计分
    scoring(playingCards: handCards[], cardType: cardsBrand): void
    {
        const cardsCR = this._typeMapForChipRatio.get(cardType)!;

        console.log("检验cardsCR");
        let chip: number = cardsCR[0];
        let ratio: number = cardsCR[1];

        console.log("筹码为" + chip);
        console.log("倍率为" + ratio);
        
        // 因为不同牌型打分情况不同
        console.log(cardType);
        let type = Number(cardType);
        console.log(type);
        switch(type)
        {
            case cardsBrand.StraightFlush:
                this._score += this.scoreStraightFlush(playingCards, chip, ratio);
                break;
            case cardsBrand.FourOfAKind:
                this._score += this.scoreFourOfAKind(playingCards, chip, ratio);
                break;
            case cardsBrand.FullHouse:
                this._score += this.scoreFullHouse(playingCards, chip, ratio);
                break;
            case cardsBrand.Flush:
                this._score += this.scoreFlush(playingCards, chip, ratio);
                break;
            case cardsBrand.Straight:
                this._score += this.scoreStraight(playingCards, chip, ratio);
                break;
            case cardsBrand.ThreeOfAKind:;
                this._score += this.scoreThreeOfAKind(playingCards, chip, ratio);
                break;
            case cardsBrand.TwoPairs:
                this._score += this.scoreTwoPair(playingCards, chip, ratio);
                break;
            case cardsBrand.OnePair:
                this._score += this.scoreOnePair(playingCards, chip, ratio);
                break;
            case cardsBrand.HighCard:
                this._score += this.scoreHighCard(playingCards, chip, ratio);
                break;
        }   
        
    }

    private scoreStraightFlush(playingCards: handCards[], chip: number, ratio: number): number
    {
        let res: number = 0;
        for(const card of playingCards)
        {
            let point = card.point;
            chip += point;
            let reinfoce: reinforcement = card.reinforce;
            switch(reinfoce)
            {
                case reinforcement.None:
                    break;
                case reinforcement.Multiplier:
                    ratio += 4;
                    break;
                case reinforcement.Rewards:
                    chip += 30;
                    break;
            }
            
        }
        res = chip * ratio;

        return res;
    }

    private scoreFourOfAKind(playingCards: handCards[], chip: number, ratio: number): number
    {
        console.log("两对使用的四条计分函数");
        let res: number = 0;
        //需要先找到不计分的那张牌
        let index: number = -1;
        // 若 index === -1 则说明每一张牌都需要计算 
        if(playingCards.length > 4)
        {
            // 计算每个牌出现的次数
            const cardCounts: { [key:number]: number } = {};
            for (const card of playingCards) {
                if (cardCounts[card.rank]) {
                    cardCounts[card.rank]++;
                } else {
                    cardCounts[card.rank] = 1;
                }
            }

            // 寻找只出现一次的牌
            for (let i = 0; i < playingCards.length; i++) {
                if (cardCounts[playingCards[i].rank] === 1) 
                {
                    index = i; // 返回不同牌的索引
                }
            }


        }

        console.log("不计入分数的牌索引为 ");
        console.log(index);

        for(let i = 0; i < playingCards.length; ++i)
        {
            if(i !== index)
            {
                // 只有组成四条的牌才计算分数
                let point = playingCards[i].point;
                chip += point;
                let reinfoce: reinforcement = playingCards[i].reinforce;
                switch(reinfoce)
                {
                    case reinforcement.None:
                        break;
                    case reinforcement.Multiplier:
                        ratio += 4;
                        break;
                    case reinforcement.Rewards:
                        chip += 30;
                        break;
                }
            }
        }
        
        res = chip * ratio;
        return res;
    }

    private scoreFullHouse(playingCards: handCards[], chip: number, ratio: number): number
    {
        let res = 0;
        res = this.scoreStraightFlush(playingCards, chip, ratio);
        return res;
    }

    private scoreFlush(playingCards: handCards[], chip: number, ratio: number): number
    {
        let res = 0;
        res = this.scoreStraightFlush(playingCards, chip, ratio);
        return res;
    }

    private scoreStraight(playingCards: handCards[], chip: number, ratio: number): number
    {
        let res = 0;
        res = this.scoreStraightFlush(playingCards, chip, ratio);
        return res;
    }

    private scoreThreeOfAKind(playingCards: handCards[], chip: number, ratio: number): number
    {
        console.log("一对调用的是三条函数");
        let res: number = 0;
        //需要先找到不计分的两张牌
        let index: number[] = [];
        // 若 index === -1 则说明每一张牌都需要计算 
        if(playingCards.length > 3)
        {
            // 计算每个牌出现的次数
            const cardCounts: { [key:number]: number } = {};
            for (const card of playingCards) {
                if (cardCounts[card.rank]) {
                    cardCounts[card.rank]++;
                } else {
                    cardCounts[card.rank] = 1;
                }
            }

            // 寻找只出现一次的牌
            for (let i = 0; i < playingCards.length; i++) {
                if (cardCounts[playingCards[i].rank] === 1) 
                {
                    // 通过inindex 访问
                    index.push(i); // 返回不同牌的索引
                }
            }

        }

        console.log("检验 出现一次的数组");
        console.log(index);

        for(let i = 0; i < playingCards.length; ++i)
        {
            let countBool = true;
            for(let j = 0; j < index.length; ++j)
            {
                if( i == index[j] )
                {
                    countBool = false;
                    break;
                }

            }
            
            if(countBool)
            {
                // 只有组成三条的牌才计算分数
                let point = playingCards[i].point;
                chip += point;
                
                let reinfoce: reinforcement = playingCards[i].reinforce;
                switch(reinfoce)
                {
                    case reinforcement.None:
                        break;
                    case reinforcement.Multiplier:
                        ratio += 4;
                    case reinforcement.Rewards:
                        chip += 30;
                }
            }
        }
        res = chip * ratio;
        return res;
    }

    private scoreTwoPair(playingCards: handCards[], chip: number, ratio: number): number
    {
        let res = 0;
        res = this.scoreFourOfAKind(playingCards, chip, ratio);
        return res;
    }

    private scoreOnePair(playingCards: handCards[], chip: number, ratio: number): number
    {
        let res = 0;
        //
        console.log("为一对打分");
        res = this.scoreThreeOfAKind(playingCards, chip, ratio);
        return res;
    }

    private scoreHighCard(playingCards: handCards[], chip: number, ratio: number): number
    {
        let res = 0;
        // 找point 最大的那张
        let max: number = 0;
        let cardId: number = 0;
        for(let id = 0; id < playingCards.length; ++id)
        {
            if(max < playingCards[id].point)
            {
                max = playingCards[id].point;
                cardId = id;
            }
        }

        chip += max;
        let reinfoce: reinforcement = playingCards[cardId].reinforce;
        switch(reinfoce)
        {
            case reinforcement.None:
                break;
            case reinforcement.Multiplier:
                ratio += 4;
                break;
            case reinforcement.Rewards:
                chip += 30;
                break;    
        }

        res = chip * ratio;
        return res;
    }

    // 关卡完成 清空分数
    clearScore(): void
    {
        this._score = 0;
    }
    
    // 单次计分完成
    displayScore(): void 
    {
        console.log("目前分数为" + this._score);
    }

    // 目前通过调用函数达成：玩家打出一次手牌，出牌次数减少的方式
    // 后续通过cocos 事件监听达成，点击出牌button 计分板上的出牌次数减少
    reactToPlaying(): void
    {
        this._playingTime--;
    }

    // 弃牌同理
    reactToDiscard(): void 
    {
        this._discardTime--;
    }

    get score(): number
    {
        return this._score;
    }

}

enum cardsBrand
{
    HighCard = 0,           // 高牌 
    OnePair= 1,            //  一对
    TwoPairs= 2,           // 两对
    ThreeOfAKind= 3,       // 三条
    Straight= 4,           // 顺子
    Flush= 5,              // 同花
    FullHouse= 6,          //  葫芦
    FourOfAKind= 7,        // 四条
    StraightFlush= 8      //  同花顺
}

// 思路：通过多态机制实现牌型的检查
// 优点: 多态机制可以提供更好的可扩展性，适合后期加入小丑牌后的开发
// 降低对象之间的耦合度
/*
class checkType
{
    execute(cards: readonly handCards[]): void{};
}

class oneCardsCheckType extends checkType
{
    execute(cards: readonly handCards[]): cardsBrand {
        
        console.log("进行单张牌的类型检查，必然高牌");
        
        return cardsBrand.HighCard;
    }   
}

class twoCardsCheckType extends checkType
{
    execute(cards: readonly handCards[]): cardsBrand {
        console.log("进行两张牌的类型检查");
        
        // 写的有点难看 不知道有没有更合适的写法
        let handCards1: handCards = cards[0];
        let handCards2: handCards = cards[1];
        if(handCards1.rank === handCards2.rank)
        {
            return cardsBrand.OnePair;
        }
        
        return cardsBrand.HighCard;
    }
}

class threeCardsCheckType extends checkType
{
    execute(cards: readonly handCards[]): cardsBrand {

        return cardsBrand.HighCard;
    }
}*/

/**
 * 牌型检查类：
 */
class checkBrandsType
{
    constructor()
    {
        console.log("牌型检查器随时到位");
    }

    // 两张牌 牌型：对子 高牌
    // 三张牌 牌型: 三条 对子 高牌
    // 四张牌 牌型: 四条 三条 两队 对子 高牌
    checkType(cards: readonly handCards[]): cardsBrand
    {
        let res: cardsBrand = cardsBrand.HighCard;
        let cardsNum: number = cards.length;

        // 判断牌型的辅助工具 记录牌面重复的牌
        const rankCounts: { [key:number]: number} = {};

        for(const card of cards)
        {
            if (rankCounts[card.rank]) {
                rankCounts[card.rank]++;
            } else {
                rankCounts[card.rank] = 1;
            }
        }
        
        // 判断牌型的关键数据
        const values = Object.values(rankCounts);
    
        // 单张牌记录
        if(cardsNum === 1)
        {}
        else if(cardsNum === 2)
        {
            console.log("两张牌的牌型比较");
            if(values.includes(2))
            {
                return cardsBrand.OnePair;
            }
        }else if(cardsNum === 3)
        {
            console.log("三张牌的牌型比较");
            if(values.includes(3))
            {
                return cardsBrand.ThreeOfAKind;
            }else if(values.includes(2))
            {
                return cardsBrand.OnePair;
            }
        }else if(cardsNum === 4)
        {
            console.log("四张牌的牌型比较");
            res = this.fourCardsTypeCheck(rankCounts);
        }else if(cardsNum === 5)
        {
            console.log("五张牌的牌型比较");
            const suitCounts: { [key:number]: number} = {};
            
            // 遍历5张牌记录花色
            for(const card of cards)
            {
                if(suitCounts[card.suit])
                {
                    suitCounts[card.suit]++;
                }else
                {
                    suitCounts[card.suit] = 1;
                }

            }

            res = this.fiveCardsTypeCheckNormal(rankCounts, suitCounts);
            //此时检查打出手牌
            console.log("此时检查打出手牌");
            console.log(cards);
        }
        
        return res;
    }

    //四张牌型
    fourCardsTypeCheck(rankMap: { [key: number]: number} ): cardsBrand
    {

        const datas = Object.values(rankMap);
        //需要另一个辅助数据
        let pairNum: number = 0;
        for(const key in rankMap)
        {
            if(rankMap[key] === 2)
            {
                pairNum++;
            }
        }

        if(datas.includes(4))
        {
            return cardsBrand.FourOfAKind;
        }else if(datas.includes(3))
        {
            return cardsBrand.ThreeOfAKind;
        }else if(pairNum === 2)
        {
            return cardsBrand.TwoPairs;
        }else if(datas.includes(2))
        {
            return cardsBrand.OnePair;
        }

        return cardsBrand.HighCard;
    }

    // 判断五张牌型
    fiveCardsTypeCheck(rankMap: { [key: number] : number}, suitMap: { [key: number]: number}, fourFingers?: boolean, shortcuts?: boolean, changeSuit?:boolean): cardsBrand
    {
        let res: cardsBrand = cardsBrand.HighCard;
        
        // 包括现版本内所有小丑牌判断机制
        // this.isStraight(rankMap, fourFingers, shortcuts);
        // this.isFlush(suitMap, fourFingers, changeSuit);

        // 新版本内所有小丑牌判断机制
        // this.isStraightNew(rankMap, fourFingers, shortcuts, newJoker);
        // this.isFlushNew(suitMap, fourFingers, changeSuit, newJoker);

        return res;
    }

    fiveCardsTypeCheckNormal(rankMap: { [key: number] : number}, suitMap: { [key: number]: number}): cardsBrand
    {
        const rankData = Object.values(rankMap);
        const suitData = Object.values(suitMap);

        //需要另一个辅助数据
        let pairNum: number = 0;
        for(const key in rankMap)
        {
            if(rankMap[key] >= 2)
            {
                pairNum++;
            }
        }
        
        if( this.isStraight(rankMap) && suitData.includes(5) )
        {
            return cardsBrand.StraightFlush;
        }else if(rankData.includes(4)|| rankData.includes(5))
        {
            return cardsBrand.FourOfAKind;
        }else if(rankData.includes(3) && pairNum === 2)
        {
            return cardsBrand.FullHouse;
        }else if(suitData.includes(5))
        {
            return cardsBrand.Flush;
        }else if(this.isStraight(rankMap))
        {
            return cardsBrand.Straight;
        }else if(rankData.includes(3))
        {
            return cardsBrand.ThreeOfAKind;
        }else if(pairNum === 2)
        {
            return cardsBrand.TwoPairs;
        }else if(rankData.includes(2))
        {
            return cardsBrand.OnePair;
        }

        return cardsBrand.HighCard;
    }

    isStraight(rankMap: { [key: number] : number}, fourFingers?: boolean, shortcuts?: boolean): boolean
    {
        let cards: number[] = [];
        for(const key in rankMap)
        {
            const value = parseInt(key);
            cards.push(value);
        }

        //测试
        if (cards && cards.length === 5)
        {
            cards.sort(); // 对牌进行排序
            //判断是否为顺子
            if ( (cards[4] - cards[0]) === 4)
            {
                return true;
            }else if(cards[0] === 2 && cards[1] === 3 && cards[2] === 4 && cards[3] === 5 && cards[4] === 14)
            {
                return true;
            }
        }
        return false;
    
    }

    private isFlush(suitMap: { [key: number]: number}, fourFingers?:boolean, changeSuit?: boolean):boolean
    {
        return true;
    }

}

///ATTENTION::: 下面是小丑牌类
/// 小丑牌的实现并非难事，但是小丑牌如何加入游戏这一设计需要斟酌。
/// 目前实现简单事件监听，通过这个EventListener 类来实现，
/// 简单举例，比如场上小丑牌如果存在 “捷径”小丑牌，此时发送给判断牌型的 checkBrandsType，调用其中适用于小丑牌的机制

// 测试第一种思路，事件监听
// 本次以捷径 四指 和 “换花色” 三张小丑牌的comb 为测试基点
class shortCutJoker
{
    // 该构造函数此处不写明，其实也需要一个事件监听，玩家按下购买按钮才会构造该牌
    constructor()
    {
        console.log("玩家购买了 捷径");
    }

    showText()
    {
        console.log("判断顺子可以跳过一个数字");
    }

    // 最初想法：小丑牌内自带判断牌型的函数，isStraight(), 并将小丑牌作为参数传入 判断牌型的函数 checkCardsType
    // 问题：这种做法不支持 多张小丑牌的同时作用，如捷径与四指同时存在。
    // 结论：放弃此法    
    // isStraight(){}

}

class fourfingerJoker
{
    //
    constructor()
    {
        console.log("玩家购买了 四指");
    }

    showText()
    {
        console.log("4张成顺 && 4张成花");
    }
}

class SuitChangeJoker
{
    constructor()
    {
        console.log("玩家购买了 花色调整");
    }

    showText()
    {
        console.log("方片和红桃视为同一花色 梅花与黑桃视为同一花色");
    }
}

class EventListener
{
    
}

class Game
{
    private _mCardSender: CardSender;
    private _mPlayer: Player;
    private _mTypeChecker: checkBrandsType;
    private _mScorePannel: JokerScorePanel;
    private _mHandCardNum;

    // 构造函数
    constructor()
    {
        // 创建发牌器实例
        this._mCardSender = new CardSender();
        // 创建玩家实例
        this._mPlayer = new Player();
        // 创建牌类型检查器
        this._mTypeChecker = new checkBrandsType();
        // 创建记分牌
        this._mScorePannel = new JokerScorePanel("Beginner", 300, 4, 4); 

        //初始化为8
        this._mHandCardNum = 8;
    }

    // 游戏开始函数
    start()
    {
        console.log("开始测试单局游戏的功能");
        console.log("开始洗牌");
        this._mCardSender.shuffle();

        //发牌器发牌，玩家获取手牌
        console.log("开始发牌");
        this._mPlayer.getCardsFromSender(this._mCardSender.sendCard(8));
        console.log("发牌完成");

        // 测试排序
        console.log("手牌根据点数排序");
        this._mPlayer.sortAccordToRank();
        console.log("手牌根据花色排序");
        this._mPlayer.sortAccordToSuit();

        // 选择牌
        let userInputs: number[] = [0,2,4,5,7];

        // 选牌的同时进行牌型检查

        // 打出 or 弃牌
        // 测试出牌
        console.log("测试出牌");
        let cardsPlayed = this._mPlayer.playCards(userInputs);
        let curType: cardsBrand = this._mTypeChecker.checkType(cardsPlayed);
        console.log("打出牌型为");
        console.log(curType);

        //开始计分
        this._mScorePannel.scoring(cardsPlayed, curType);
        
        // 记分牌加分并显示
        this._mScorePannel.displayScore();

        //补牌
        let supNum = this._mHandCardNum - this._mPlayer.handCardsNum;
        let supplementCards = this._mCardSender.supplementingCards(supNum);
        this._mPlayer.getCardsFromSender(supplementCards);

    }


    askForNumber(index: number): number[] {

        let userSelectionCards: number[] = [];

        rl.question(`请输入第 ${index + 1} 个数字：`, (input) => {
          const uInput = parseFloat(input);
          if (isNaN(uInput)) {
            console.log('输入无效，请输入一个有效的数字！');
            this.askForNumber(index); // 重新询问
          } else {
            userSelectionCards.push(uInput);
            console.log(userSelectionCards);
            if (index < 4) {
              this.askForNumber(index + 1); // 继续询问下一个数字
            } else {
              console.log('你输入的五个数字是：', userSelectionCards);
              rl.close();
            }
          }
        });

        return userSelectionCards; 
    }

}


// let cs = new CardSender();
// cs.shuffle();
// let cardsInHand = cs.sendCard(8);
// let chosenCards: handCards[] = [];

// let card1: handCards = new handCards(Suit.Club, cardRank.Ten);  
// let card2: handCards = new handCards(Suit.Club, cardRank.Jack);  
// let card3: handCards = new handCards(Suit.Club, cardRank.Queen);  
// let card4: handCards = new handCards(Suit.Club, cardRank.King); 
// let card5: handCards = new handCards(Suit.Club, cardRank.Ace); 

// chosenCards.push(card1);
// chosenCards.push(card2);
// chosenCards.push(card3);
// chosenCards.push(card4);
// chosenCards.push(card5);
// console.log(chosenCards);

// let cardsCheck = new checkBrandsType();
// let type: cardsBrand = cardsCheck.checkType(chosenCards);
// console.log(type);

let shortCutsCard = new shortCutJoker();

let game = new Game();
game.start();