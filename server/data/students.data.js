const surnames = ["Ah", "Ang", "Au-yeung", "Au-yong", "Bai", "Ban", "Bao", "Bei", "Ben", "Bian", "Bie", "Bin", "Bu", "Bun", "But", "Cai", "Cang", "Cao", "Cen", "Cha", "Chai", "Chaim", "Chak", "Cham", "Chan", "Chang", "Chao", "Chau", "Che", "Cheah", "Chee", "Chen", "Cheng", "Cheong", "Cheuk", "Cheung", "Chew", "Chi", "Chia", "Chiam", "Chiang", "Chieu", "Chik", "Chim", "Chin", "Ching", "Chit", "Chiu", "Chng", "Cho", "Choi", "Chong", "Choo", "Choong", "Chou", "Chow", "Choy", "Chu", "Chua", "Chuan", "Chuen", "Chui", "Chuk", "Chum", "Chun", "Chung", "Chye", "Cong", "Cui", "Cun", "Da", "Dai", "Dan", "Dang", "Deng", "Di", "Dian", "Diao", "Ding", "Dong", "Dou", "Du", "Duan", "Dun", "Dung", "Duo", "Eng", "Fa", "Fai", "Fang", "Fei", "Fen", "Feng", "Fok", "Fong", "Foong", "Fu", "Fung", "Gai", "Gan", "Gao", "Gauk", "Gee", "Geng", "Goh", "Gok", "Gong", "Gooi", "Guan", "Guang", "Gui", "Guo", "Gwock", "Ha", "Hai", "Hak", "Han", "Hang", "Hao", "Har", "Hau", "He", "Hei", "Heng", "Heung", "Ho", "Hoi", "Hom", "Hon", "Hong", "Hor", "Hou", "Hsiao", "Hsieh", "Hsu", "Hua", "Huai", "Huan", "Huang", "Hui", "Huie", "Hung", "Huo", "Hwang", "Ip", "Iu", "Jeng", "Ji", "Jia", "Jian", "Jiang", "Jiao", "Jie", "Jin", "Jing", "Joe", "Jong", "Ju", "Ka", "Kai", "Kam", "Kan", "Kang", "Kar", "Kat", "Kau", "Kaur", "Kee", "Kei", "Keung", "Khoo", "Khu", "King", "Kit", "Kiu", "Ko", "Koh", "Koi", "Kok", "Kon", "Kong", "Koo", "Koon", "Kot", "Ku", "Kuan", "Kuang", "Kuet", "Kui", "Kuk", "Kung", "Kuo", "Kwai", "Kwan", "Kwek", "Kwo", "Kwok", "Kwong", "Lai", "Lak", "Lam", "Lan", "Lang", "Lao", "Lau", "Le", "Lee", "Lei", "Leong", "Leow", "Leung", "Lew", "Lian", "Liang", "Liao", "Lie", "Liew", "Lim", "Lin", "Ling", "Lit", "Liu", "Lo", "Loh", "Loi", "Lok", "Loke", "Long", "Loo", "Lou", "Low", "Luan", "Lui", "Luk", "Lum", "Lun", "Lung", "Luo", "Mah", "Mai", "Mak", "Mang", "Mao", "Mar", "Mat", "Mau", "Mei", "Meng", "Mi", "Miao", "Min", "Ming", "Miu", "Mok", "Mon", "Moon", "Mou", "Moy", "Mui", "Muk", "Mun", "Mung", "Nam", "Nan", "Nau", "Nei", "Neng", "Neo", "Nga", "Ngai", "Ngan", "Ngau", "Ngeun", "Ngok", "Ngon", "Nie", "Ning", "Nip", "Niu", "Noi", "Nong", "Nung", "Oei", "Oh", "On", "Ooi", "Or", "Ou", "Ou-yang", "Ow", "Ow-yang", "Pak", "Pan", "Pang", "Pau", "Peh", "Pei", "Peng", "Phang", "Phua", "Pi", "Piao", "Pit", "Png", "Po", "Poh", "Pok", "Pong", "Poon", "Pu", "Pui", "Pun", "Qi", "Qian", "Qiang", "Qiao", "Qin", "Qing", "Qiu", "Qu", "Quah", "Quan", "Que", "Quek", "Ran", "Rao", "Rong", "Ruan", "Rui", "Sai", "Sam", "San", "Sang", "Sat", "Sau", "Seah", "See", "See-ma", "Seet", "Seow", "Seto", "Seung", "Sha", "Sham", "Shan", "Shang", "Shao", "Shau", "She", "Shea", "Shek", "Shen", "Sheng", "Sheung", "Shi", "Shim", "Shing", "Shiu", "Shou", "Shu", "Shuang", "Shui", "Shuk", "Shum", "Shun", "Si-ma", "Si-tu", "Sia", "Siew", "Sik", "Sim", "Sin", "Sing", "Singh", "Sit", "Siu", "Sng", "Soh", "Soo", "Soon", "Su-tu", "Suen", "Suet", "Sui", "Suk", "Sum", "Sun", "Sung", "Suo", "Sze", "Sze-ma", "Ta", "Tai", "Tak", "Tam", "Tan", "Tang", "Tao", "Tap", "Tat", "Tau", "Tay", "Tee", "Teng", "Teo", "Tham", "The", "Thean", "Thian", "Thien", "Tian", "Tie", "Tik", "Tin", "Ting", "Tip", "Tiu", "Toh", "Toi", "Tok", "Tong", "Tou", "Tow", "Tsai", "Tsang", "Tsat", "Tse", "Tseng", "Tseung", "Tsik", "Tsim", "Tsin", "Tso", "Tsoi", "Tsou", "Tsu", "Tsui", "Tsun", "Tsung", "Tsz", "Tu", "Tuen", "Tun", "Tung", "Tuo", "Tut", "Tze", "Wah", "Wai", "Wan", "Wat", "Wee", "Wei", "Wen", "Weng", "Wo", "Won", "Wong", "Woo", "Woon", "Wu", "Xi", "Xia", "Xian", "Xiang", "Xiao", "Xie", "Xing", "Xiong", "Xiu", "Xu", "Xuan", "Xue", "Xun", "Ya", "Yam", "Yan", "Yang", "Yao", "Yap", "Yau", "Yee", "Yeh", "Yeo", "Yep", "Yeung", "Yew", "Yi", "Yik", "Yim", "Yin", "Ying", "Yip", "Yiu", "Yong", "Young", "Yu", "Yue", "Yuen", "Yuet", "Yui", "Yuk", "Yung", "Zai", "Zan", "Zang", "Zeng", "Zha", "Zhai", "Zhan", "Zhang", "Zhao", "Zhe", "Zhen", "Zheng", "Zhi", "Zhong", "Zhou", "Zhu", "Zhuang", "Zhuo", "Zi", "Zong", "Zou", "Zu", "Zuo"];
const givennames = ["Tai Man", "Kwan Kin", "Tsz Him", "Yat Fung", "Man Ki", "Ka Lung", "Pui Ki", "Wan Kei", "Tsz Wai", "Ka Shing", "Chi Wai", "Yue Chung", "Ho Sum", "Tsz Wai", "Ka Shing", "Cheuk Hong", "Kwok On", "Chit Fai", "Chi Keung", "Ting Yin", "Pok Him", "Wing Yee", "Chun Yin", "Tat Wing", "Kwok Wah", "Ching Lam", "Sai Tai", "Chun Yiu", "Ying Kit", "Wai Ho", "Pui Shan", "Chor Ying", "Hoi Ping", "Ho Man", "Chun Ho", "Chi Yat", "Hoi Fu", "Kwan Yin", "Sing Him", "Wai Chun", "Ho Ching", "Yeung Kwan", "Ka Suen", "Tsz Chung", "Chun Chi", "Ha Wai", "Ka Wai", "Po Han", "King Sum", "Ka Lok", "Cheuk Ying", "Hoi Ching", "King Sang", "Wai Pang", "Shing Him", "Wing Hong", "Yiu On", "Sau Hung", "Ka Wai", "Pui Man", "Kai Chung", "Kam Kuen", "Siu On", "Kier Jose", "Chi Shing", "Jia Yi", "Man Hin", "Chi Chung", "Ming Sun", "Wing Lok", "Man Chung", "Yu Fung", "Ka Hei", "Kit Fung", "Tsz Shing", "Ming Tim", "Ching Wa", "Koi Yin", "Ka Him", "Ho Fung", "Ka Kit", "Po Yin", "Wai Ki", "Yiu Chuen", "Chun Lam", "Chun Ho", "Yik Fai", "Ho Yin", "Kin Yu", "Kwok Tai", "Pan Pan", "Tsz Yui", "Yan Wai", "Yuen Wa", "Siu Hin", "Chun Ho", "Hok Sum"];

exports.genRecord = function (seed) {
    function getRandomItem(array) {
        return array[parseInt(seed.random() * array.length)];
    }

    const students = [];

    for (let i = 0; i < 1000; i++) {
        let stuName = getRandomItem(surnames) + ' ' + getRandomItem(givennames);

        let num = (i + '').padStart(3, '0');
        let year = Math.floor(seed.random() * 10) + 1988;
        let month = Math.floor(seed.random() * 12) + 1;
        month = (month + '').padStart(2, '0');
        let day = Math.floor(seed.random() * 28) + 1;
        day = (day + '').padStart(2, '0');
        students.push({
            _id: `151${month}${num}`,
            stuName,
            dOB: new Date(`${year}-${month}-${day}`)
        });
    }
    return students;
}