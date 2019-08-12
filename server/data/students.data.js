const stuNames = [
    "Chan Tai Man",
    "Chan Kwan Kin", "Chan Tsz Him", "Chan Yat Fung", "Chiu Man Ki", "Cheng Ka Lung", "Choi Pui Ki", "Chiu Wan Kei", "Chung Tsz Wai", "Cho Ka Shing", "Hung Chi Wai", "Choi Yue Chung", "Fok Ho Sum", "Ho Tsz Wai", "Lai Ka Shing", "Ip Cheuk Hong", "Lai Kwok On", "Lam Chit Fai", "Lam Chi Keung", "Lam Ting Yin", "Lau Pok Him", "Li Wing Yee", "Li Chun Yin", "Liu Tat Wing", "Lin Yunsong", "Mehmood Asif", "Su Qiping", "Ng Kwok Wah", "Tam Ching Lam", "Shek Sai Tai", "Tiu Chun Yiu", "Tam Ying Kit", "Tong Wai Ho", "Wong Pui Shan", "Wong Chor Ying", "Yam Hoi Ming Herman", "Wong Hoi Ping", "Yiu Ho Man", "Chan Chun Ho", "Ip Chi Yat", "Chan Hoi Fu",
    "Chan Tai Man",
    "Keung Man Ho Martin", "Chan Kwan Yin", "Kwan Sing Him", "Chan Wai Chun", "Lam Ho Ching", "Chan Yeung Kwan", "Lam Ka Suen", "Chao Tsz Chung", "Lau Chun Chi", "Chau Ha Wai", "Lau Ka Wai", "Chen Po Han", "Lau King Sum", "Cheng Ka Lok", "Law Cheuk Ying", "Cheung Hoi Ching", "Law King Sang", "Cheung Wai Pang", "Law Shing Him", "Chiu Wing Hong", "Law Yiu On", "Chong Sau Hung", "Lee Ka Wai", "Chow Pui Man", "Leung Kai Chung", "Chu Kam Kuen", "Leung Siu On", "Daluz Kier Jose", "Li Chi Shing", "Deng Jia Yi", "Li Man Hin", "Fok Chi Chung", "Liong Ming Sun", "Fung Wing Lok", "Liu Man Chung", "Hon Yu Fung", "Lo Ka Hei", "Hong Kit Fung", "Lo Tsz Shing", "Wong Ming Tim", "Luk Ching Wa", "Ma Koi Yin", "Mak Ka Him", "Man Ho Fung", "Man Ka Kit", "Ng Po Yin", "Ng Sze Yeung Chris", "Ng Wai Ki", "Ng Yiu Chuen", "Pang Chun Lam", "Rai Nischal", "Tao Yeh", "Tsang Chun Ho", "Tsui Christopher Lap Yin", "Tsui Yik Fai", "Wan Ho Yin", "Wong Kin Yu", "Wong Kwok Tai", "Wong Pan Pan", "Wong Tsz Yui", "Wong Yan Wai", "Wong Yuen Wa", "Xu Siu Hin", "Yeung Chun Ho", "Yeung Hok Sum", "Yiong Hei Tung Marcia",
    "Chan Tai Man"
];

exports.genRecord = function(seed){

    const students = [];

    for (let i = 1; i <= stuNames.length; i++) {
        let stuName = stuNames[i - 1];
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