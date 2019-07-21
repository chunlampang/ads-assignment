const stuNames = [
    'Chan Tai Man',
    'CHAN Kwan Kin', 'CHAN Tsz Him', 'CHAN Yat Fung', 'CHIU Man Ki',
    'CHENG Ka Lung', 'CHOI Pui Ki', 'CHIU Wan Kei', 'CHUNG Tsz Wai',
    'CHO Ka Shing', 'HUNG Chi Wai', 'CHOI Yue Chung', 'FOK Ho Sum',
    'HO Tsz Wai', 'LAI Ka Shing', 'IP Cheuk Hong', 'LAI Kwok On',
    'LAM Chit Fai', 'LAM Chi Keung', 'LAM Ting Yin', 'LAU Pok Him',
    'LI Wing Yee', 'LI Chun Yin', 'LIU Tat Wing', 'LIN Yunsong',
    'MEHMOOD Asif', 'SU Qiping', 'NG Kwok Wah', 'TAM Ching Lam',
    'SHEK Sai Tai', 'TIU Chun Yiu', 'TAM Ying Kit', 'TONG Wai Ho',
    'WONG Pui Shan', 'WONG Chor Ying', 'YAM Hoi Ming Herman', 'WONG Hoi Ping',
    'YIU Ho Man', 'CHAN Chun Ho', 'IP Chi Yat', 'CHAN Hoi Fu',
    'Chan Tai Man',
    'KEUNG Man Ho Martin', 'CHAN Kwan Yin', 'KWAN Sing Him', 'CHAN Wai Chun',
    'LAM Ho Ching', 'CHAN Yeung Kwan', 'LAM Ka Suen', 'CHAO Tsz Chung',
    'LAU Chun Chi', 'CHAU Ha Wai', 'LAU Ka Wai', 'CHEN Po Han',
    'LAU King Sum', 'CHENG Ka Lok', 'LAW Cheuk Ying', 'CHEUNG Hoi Ching',
    'LAW King Sang', 'CHEUNG Wai Pang', 'LAW Shing Him', 'CHIU Wing Hong',
    'LAW Yiu On', 'CHONG Sau Hung', 'LEE Ka Wai', 'CHOW Pui Man',
    'LEUNG Kai Chung', 'CHU Kam Kuen', 'LEUNG Siu On', 'DALUZ Kier Jose',
    'LI Chi Shing', 'DENG Jia Yi', 'LI Man Hin', 'FOK Chi Chung',
    'LIONG Ming Sun', 'FUNG Wing Lok', 'LIU Man Chung', 'HON Yu Fung',
    'LO Ka Hei', 'HONG Kit Fung', 'LO Tsz Shing', 'WONG Ming Tim',
    'LUK Ching Wa', 'MA Koi Yin', 'MAK Ka Him', 'MAN Ho Fung',
    'MAN Ka Kit', 'NG Po Yin', 'NG Sze Yeung Chris', 'NG Wai Ki',
    'NG Yiu Chuen', 'PANG Chun Lam', 'RAI Nischal', 'TAO Yeh',
    'TSANG Chun Ho', 'TSUI Christopher Lap Yin', 'TSUI Yik Fai', 'WAN Ho Yin',
    'WONG Kin Yu', 'WONG Kwok Tai', 'WONG Pan Pan', 'WONG Tsz Yui',
    'WONG Yan Wai', 'WONG Yuen Wa', 'XU Siu Hin', 'YEUNG Chun Ho',
    'YEUNG Hok Sum', 'YIONG Hei Tung Marcia',
    'Chan Tai Man',
]

const students = [];

for (let i = 1; i <= stuNames.length; i++) {
    let stuName = stuNames[i];
    let num = ("00" + i).slice(-3);
    let year = Math.floor(Math.random() * 10) + 1988;
    let month = Math.floor(Math.random() * 12) + 1;
    month = ("0" + i).slice(-2);
    let day = Math.floor(Math.random() * 28) + 1;
    day = ("0" + i).slice(-2);
    students.push({
        _id: `151${month}${num}`,
        stuName,
        dOB: new Date(`${year}-${month}-${day}`)
    });
}

module.exports = students;