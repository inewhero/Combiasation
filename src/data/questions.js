export const surveyData = {
  zh: {
    title: "G20国家相似度调查",
    intro: "这是一项完全匿名的研究，需要您根据自己的主观印象对G20的成员国进行“相似度”的评价，0%代表非常不相似，100%代表非常相似。\n参与本实验可能需要花费15分钟左右的时间，待结果审核后您将获得5-10元范围的随机报酬。感谢您愿意抽出宝贵时间来参加本次答题，现在我们就马上开始吧！",
    consent: {
      text: "知情同意书\n\n本研究旨在调查人们对G20国家相似度的看法。您的参与完全自愿，您可以随时退出研究而不受任何惩罚。您的回答将完全匿名，仅用于学术研究。\n\n如果您同意参与本研究，请点击下方的“同意”按钮。",
      agree: "同意",
      disagree: "不同意"
    },
    info: "二十国集团（英语：Group of Twenty，缩写：G20）是一个国际经济合作论坛，于1999年9月26日在德国柏林成立，由七国集团（加拿大、美国、英国、法国、德国、意大利、日本）、金砖国家最初5国（巴西、俄罗斯、印度、中国、南非）、七个重要经济体（墨西哥、阿根廷、土耳其、韩国、印度尼西亚、澳大利亚、沙特阿拉伯）及两个区域组织欧洲联盟和非洲联盟组成。",
    info_U: "二十国集团（英语：Group of Twenty，缩写：G20）是一个国际经济合作论坛，于1999年9月26日在德国柏林成立，由七国集团（加拿大、美国、英国、法国、德国、意大利、日本）、金砖国家最初5国（巴西、俄罗斯、印度、中国、南非）、七个重要经济体（墨西哥、阿根廷、土耳其、韩国、印度尼西亚、澳大利亚、沙特阿拉伯）及两个区域组织欧洲联盟和非洲联盟组成。\n其中，\n欧洲联盟有27个成员国：奥地利、比利时、保加利亚、塞浦路斯、捷克、克罗地亚、丹麦、爱沙尼亚、芬兰、法国、德国、希腊、匈牙利、爱尔兰、意大利、拉脱维亚、罗马尼亚、立陶宛、卢森堡、马耳他、荷兰、波兰、葡萄牙、斯洛伐克、斯洛文尼亚、西班牙和瑞典。\n非洲联盟由55个非洲国家组成：阿尔及利亚、埃及、埃塞俄比亚、安哥拉、贝宁、博茨瓦纳、布基纳法索、布隆迪、赤道几内亚、多哥、厄立特里亚、佛得角、冈比亚、刚果（布）、刚果（金）、吉布提、几内亚、几内亚比绍、加纳，加蓬，津巴布韦，喀麦隆，科摩罗，科特迪瓦，肯尼亚，莱索托，利比里亚，利比亚，卢旺达，马达加斯加，马拉维，马里，毛里求斯，毛里塔尼亚，莫桑比克，纳米比亚，南非，尼日尔，尼日利亚，塞拉利昂，塞内加尔，塞舌尔，圣多美和普林西比，斯威士兰，苏丹，索马里，坦桑尼亚，突尼斯，乌干达，赞比亚，乍得，中非共和国和摩洛哥。",
    socialStatusInstruction: "想象这个梯子代表了人们在社会中的地位。梯子顶端的人是那些情况最好的人，他们拥有最多的金钱、最高的教育程度和最好的工作。梯子底端的人是那些情况最差的人，他们拥有的金钱最少、教育程度最低，工作最差或没有工作。\n您认为您自己处于哪个位置？",
    socialStatusLabels: {
      best: "情况最好",
      worst: "情况最差"
    },
    sliderLabels: {
      dissimilar: "0% (非常不相似)",
      similar: "100% (非常相似)"
    },
    buttons: {
      next: "下一题",
      submit: "提交"
    },
    endPage: {
      paymentInstruction: "请扫描下方二维码或点击链接进入打款平台，填写您的唯一ID（UUID）并等待人工核查。核查通过后将发放被试费。",
      paymentLinkText: "点击此处进入打款平台",
      paymentLink: "https://www.wenjuan.com/s/UZBZJvAzEtc/"
    },
    personalInfo: [
      {
        id: "birth_date",
        type: "date",
        label: "出生日期",
        required: true
      },
      {
        id: "gender",
        type: "single_choice",
        label: "性别",
        options: ["男", "女", "其他"],
        required: true
      },
      {
        id: "education",
        type: "single_choice",
        label: "受教育水平",
        options: ["小学", "初中", "高中", "大学", "硕士", "博士"],
        required: true
      },
      {
        id: "second_languages",
        type: "number",
        label: "能进行日常交流的第二语言数",
        required: true
      },
      {
        id: "social_status",
        type: "scale",
        label: "主观社会地位（从1-10级阶梯进行选择）",
        min: 1,
        max: 10,
        required: true
      }
    ],
    sliderPrompt: "请根据你的主观印象为以下两个国家的相似度进行0%到100%之间的评分：",
    sliderPairs: [
      "阿根廷 和 澳大利亚", "阿根廷 和 巴西", "阿根廷 和 加拿大", "阿根廷 和 中国", "阿根廷 和 法国", "阿根廷 和 德国", "阿根廷 和 印度", "阿根廷 和 印度尼西亚", "阿根廷 和 意大利", "阿根廷 和 日本", "阿根廷 和 墨西哥", "阿根廷 和 俄罗斯", "阿根廷 和 沙特阿拉伯", "阿根廷 和 南非", "阿根廷 和 韩国", "阿根廷 和 土耳其", "阿根廷 和 英国", "阿根廷 和 美国",
      "澳大利亚 和 巴西", "澳大利亚 和 加拿大", "澳大利亚 和 中国", "澳大利亚 和 法国", "澳大利亚 和 德国", "澳大利亚 和 印度", "澳大利亚 和 印度尼西亚", "澳大利亚 和 意大利", "澳大利亚 和 日本", "澳大利亚 和 墨西哥", "澳大利亚 和 俄罗斯", "澳大利亚 和 沙特阿拉伯", "澳大利亚 和 南非", "澳大利亚 和 韩国", "澳大利亚 和 土耳其", "澳大利亚 和 英国", "澳大利亚 和 美国",
      "巴西 和 加拿大", "巴西 和 中国", "巴西 和 法国", "巴西 和 德国", "巴西 和 印度", "巴西 和 印度尼西亚", "巴西 和 意大利", "巴西 和 日本", "巴西 和 墨西哥", "巴西 和 俄罗斯", "巴西 和 沙特阿拉伯", "巴西 和 南非", "巴西 和 韩国", "巴西 和 土耳其", "巴西 和 英国", "巴西 和 美国",
      "加拿大 和 中国", "加拿大 和 法国", "加拿大 和 德国", "加拿大 和 印度", "加拿大 和 印度尼西亚", "加拿大 和 意大利", "加拿大 和 日本", "加拿大 和 墨西哥", "加拿大 和 俄罗斯", "加拿大 和 沙特阿拉伯", "加拿大 和 南非", "加拿大 和 韩国", "加拿大 和 土耳其", "加拿大 和 英国", "加拿大 和 美国",
      "中国 和 法国", "中国 和 德国", "中国 和 印度", "中国 和 印度尼西亚", "中国 和 意大利", "中国 和 日本", "中国 和 墨西哥", "中国 和 俄罗斯", "中国 和 沙特阿拉伯", "中国 和 南非", "中国 和 韩国", "中国 和 土耳其", "中国 和 英国", "中国 和 美国",
      "法国 和 德国", "法国 和 印度", "法国 和 印度尼西亚", "法国 和 意大利", "法国 和 日本", "法国 和 墨西哥", "法国 和 俄罗斯", "法国 和 沙特阿拉伯", "法国 和 南非", "法国 和 韩国", "法国 和 土耳其", "法国 和 英国", "法国 和 美国",
      "德国 和 印度", "德国 和 印度尼西亚", "德国 和 意大利", "德国 和 日本", "德国 和 墨西哥", "德国 和 俄罗斯", "德国 和 沙特阿拉伯", "德国 和 南非", "德国 和 韩国", "德国 和 土耳其", "德国 和 英国", "德国 和 美国",
      "印度 和 印度尼西亚", "印度 和 意大利", "印度 和 日本", "印度 和 墨西哥", "印度 和 俄罗斯", "印度 和 沙特阿拉伯", "印度 和 南非", "印度 和 韩国", "印度 和 土耳其", "印度 和 英国", "印度 和 美国",
      "印度尼西亚 和 意大利", "印度尼西亚 和 日本", "印度尼西亚 和 墨西哥", "印度尼西亚 和 俄罗斯", "印度尼西亚 和 沙特阿拉伯", "印度尼西亚 和 南非", "印度尼西亚 和 韩国", "印度尼西亚 和 土耳其", "印度尼西亚 和 英国", "印度尼西亚 和 美国",
      "意大利 和 日本", "意大利 和 墨西哥", "意大利 和 俄罗斯", "意大利 和 沙特阿拉伯", "意大利 和 南非", "意大利 和 韩国", "意大利 和 土耳其", "意大利 和 英国", "意大利 和 美国",
      "日本 和 墨西哥", "日本 和 俄罗斯", "日本 和 沙特阿拉伯", "日本 和 南非", "日本 和 韩国", "日本 和 土耳其", "日本 和 英国", "日本 和 美国",
      "墨西哥 和 俄罗斯", "墨西哥 和 沙特阿拉伯", "墨西哥 和 南非", "墨西哥 和 韩国", "墨西哥 和 土耳其", "墨西哥 和 英国", "墨西哥 和 美国",
      "俄罗斯 和 沙特阿拉伯", "俄罗斯 和 南非", "俄罗斯 和 韩国", "俄罗斯 和 土耳其", "俄罗斯 和 英国", "俄罗斯 和 美国",
      "沙特阿拉伯 和 南非", "沙特阿拉伯 和 韩国", "沙特阿拉伯 和 土耳其", "沙特阿拉伯 和 英国", "沙特阿拉伯 和 美国",
      "南非 和 韩国", "南非 和 土耳其", "南非 和 英国", "南非 和 美国",
      "韩国 和 土耳其", "韩国 和 英国", "韩国 和 美国",
      "土耳其 和 英国", "土耳其 和 美国",
      "英国 和 美国"
    ],
    sliderPairs_U: [      "阿根廷 和 澳大利亚", "阿根廷 和 巴西", "阿根廷 和 加拿大", "阿根廷 和 中国", "阿根廷 和 法国", "阿根廷 和 德国", "阿根廷 和 印度", "阿根廷 和 印度尼西亚", "阿根廷 和 意大利", "阿根廷 和 日本", "阿根廷 和 墨西哥", "阿根廷 和 俄罗斯", "阿根廷 和 沙特阿拉伯", "阿根廷 和 南非", "阿根廷 和 韩国", "阿根廷 和 土耳其", "阿根廷 和 英国", "阿根廷 和 美国", "阿根廷 和 非洲联盟", "阿根廷 和 欧洲联盟",
      "澳大利亚 和 巴西", "澳大利亚 和 加拿大", "澳大利亚 和 中国", "澳大利亚 和 法国", "澳大利亚 和 德国", "澳大利亚 和 印度", "澳大利亚 和 印度尼西亚", "澳大利亚 和 意大利", "澳大利亚 和 日本", "澳大利亚 和 墨西哥", "澳大利亚 和 俄罗斯", "澳大利亚 和 沙特阿拉伯", "澳大利亚 和 南非", "澳大利亚 和 韩国", "澳大利亚 和 土耳其", "澳大利亚 和 英国", "澳大利亚 和 美国", "澳大利亚 和 非洲联盟", "澳大利亚 和 欧洲联盟",
      "巴西 和 加拿大", "巴西 和 中国", "巴西 和 法国", "巴西 和 德国", "巴西 和 印度", "巴西 和 印度尼西亚", "巴西 和 意大利", "巴西 和 日本", "巴西 和 墨西哥", "巴西 和 俄罗斯", "巴西 和 沙特阿拉伯", "巴西 和 南非", "巴西 和 韩国", "巴西 和 土耳其", "巴西 和 英国", "巴西 和 美国", "巴西 和 非洲联盟", "巴西 和 欧洲联盟",
      "加拿大 和 中国", "加拿大 和 法国", "加拿大 和 德国", "加拿大 和 印度", "加拿大 和 印度尼西亚", "加拿大 和 意大利", "加拿大 和 日本", "加拿大 和 墨西哥", "加拿大 和 俄罗斯", "加拿大 和 沙特阿拉伯", "加拿大 和 南非", "加拿大 和 韩国", "加拿大 和 土耳其", "加拿大 和 英国", "加拿大 和 美国", "加拿大 和 非洲联盟", "加拿大 和 欧洲联盟",
      "中国 和 法国", "中国 和 德国", "中国 和 印度", "中国 和 印度尼西亚", "中国 和 意大利", "中国 和 日本", "中国 和 墨西哥", "中国 和 俄罗斯", "中国 和 沙特阿拉伯", "中国 和 南非", "中国 和 韩国", "中国 和 土耳其", "中国 和 英国", "中国 和 美国", "中国 和 非洲联盟", "中国 和 欧洲联盟",
      "法国 和 德国", "法国 和 印度", "法国 和 印度尼西亚", "法国 和 意大利", "法国 和 日本", "法国 和 墨西哥", "法国 和 俄罗斯", "法国 和 沙特阿拉伯", "法国 和 南非", "法国 和 韩国", "法国 和 土耳其", "法国 和 英国", "法国 和 美国", "法国 和 非洲联盟", "法国 和 欧洲联盟",
      "德国 和 印度", "德国 和 印度尼西亚", "德国 和 意大利", "德国 和 日本", "德国 和 墨西哥", "德国 和 俄罗斯", "德国 和 沙特阿拉伯", "德国 和 南非", "德国 和 韩国", "德国 和 土耳其", "德国 和 英国", "德国 和 美国", "德国 和 非洲联盟", "德国 和 欧洲联盟",
      "印度 和 印度尼西亚", "印度 和 意大利", "印度 和 日本", "印度 和 墨西哥", "印度 和 俄罗斯", "印度 和 沙特阿拉伯", "印度 和 南非", "印度 和 韩国", "印度 和 土耳其", "印度 和 英国", "印度 和 美国", "印度 和 非洲联盟", "印度 和 欧洲联盟",
      "印度尼西亚 和 意大利", "印度尼西亚 和 日本", "印度尼西亚 和 墨西哥", "印度尼西亚 和 俄罗斯", "印度尼西亚 和 沙特阿拉伯", "印度尼西亚 和 南非", "印度尼西亚 和 韩国", "印度尼西亚 和 土耳其", "印度尼西亚 和 英国", "印度尼西亚 和 美国", "印度尼西亚 和 非洲联盟", "印度尼西亚 和 欧洲联盟",
      "意大利 和 日本", "意大利 和 墨西哥", "意大利 和 俄罗斯", "意大利 和 沙特阿拉伯", "意大利 和 南非", "意大利 和 韩国", "意大利 和 土耳其", "意大利 和 英国", "意大利 和 美国", "意大利 和 非洲联盟", "意大利 和 欧洲联盟",
      "日本 和 墨西哥", "日本 和 俄罗斯", "日本 和 沙特阿拉伯", "日本 和 南非", "日本 和 韩国", "日本 和 土耳其", "日本 和 英国", "日本 和 美国", "日本 和 非洲联盟", "日本 和 欧洲联盟",
      "墨西哥 和 俄罗斯", "墨西哥 和 沙特阿拉伯", "墨西哥 和 南非", "墨西哥 和 韩国", "墨西哥 和 土耳其", "墨西哥 和 英国", "墨西哥 和 美国", "墨西哥 和 非洲联盟", "墨西哥 和 欧洲联盟",
      "俄罗斯 和 沙特阿拉伯", "俄罗斯 和 南非", "俄罗斯 和 韩国", "俄罗斯 和 土耳其", "俄罗斯 和 英国", "俄罗斯 和 美国", "俄罗斯 和 非洲联盟", "俄罗斯 和 欧洲联盟",
      "沙特阿拉伯 和 南非", "沙特阿拉伯 和 韩国", "沙特阿拉伯 和 土耳其", "沙特阿拉伯 和 英国", "沙特阿拉伯 和 美国", "沙特阿拉伯 和 非洲联盟", "沙特阿拉伯 和 欧洲联盟",
      "南非 和 韩国", "南非 和 土耳其", "南非 和 英国", "南非 和 美国", "南非 和 非洲联盟", "南非 和 欧洲联盟",
      "韩国 和 土耳其", "韩国 和 英国", "韩国 和 美国", "韩国 和 非洲联盟", "韩国 和 欧洲联盟",
      "土耳其 和 英国", "土耳其 和 美国", "土耳其 和 非洲联盟", "土耳其 和 欧洲联盟",
      "英国 和 美国", "英国 和 非洲联盟", "英国 和 欧洲联盟",
      "美国 和 非洲联盟", "美国 和 欧洲联盟",
      "非洲联盟 和 欧洲联盟"],
    multipleChoicePrompt: "您对 {pair} 相似性的评分主要基于以下哪些因素来判断？",
    multipleChoiceOptions: [
      "地理位置", "气候条件", "历史背景", "语言文化", "经济结构", "政治体系", "科技水平", "社会组成", "国际关系", "生活方式"
    ],
    longTextPrompt: "总的来说，您在评价两个国家的相似性时会以怎样的方式思考？（建议使用语音识别输入口语化的表达）"
  },
  en: {
    title: "G20 Country Similarity Survey",
    socialStatusLabels: {
      best: "Best off",
      worst: "Worst off"
    },
    sliderLabels: {
      dissimilar: "0% (Dissimilar)",
      similar: "100% (Similar)"
    },
    intro: "This is a completely anonymous study that requires you to evaluate the \"similarity\" of G20 member countries based on your subjective impressions. 0% represents very dissimilar, and 100% represents very similar. Participating in this experiment may take about 15 minutes of your time. After the results are reviewed, you will receive a random reward ranging from 5 to 10 yuan. Thank you for taking the time to participate in this survey. Let's get started!",
    consent: {
      text: "Informed Consent\n\nThis study aims to investigate perceptions of similarity between G20 countries. Your participation is completely voluntary, and you may withdraw from the study at any time without penalty. Your responses will be completely anonymous and used for academic research purposes only.\n\nIf you agree to participate in this study, please click the \"Agree\" button below.",
      agree: "Agree",
      disagree: "Disagree"
    },
    info: "The Group of Twenty (G20) is an international economic cooperation forum established on September 26, 1999, in Berlin, Germany. It consists of the G7 countries (Canada, the United States, the United Kingdom, France, Germany, Italy, Japan), the original five BRICS countries (Brazil, Russia, India, China, South Africa), seven major emerging economies (Mexico, Argentina, Turkey, South Korea, Indonesia, Australia, Saudi Arabia), and two regional organizations: the European Union and the African Union.",
    info_U: "The Group of Twenty (G20) is an international economic cooperation forum established on September 26, 1999, in Berlin, Germany. It consists of the G7 countries (Canada, the United States, the United Kingdom, France, Germany, Italy, Japan), the original five BRICS countries (Brazil, Russia, India, China, South Africa), seven major emerging economies (Mexico, Argentina, Turkey, South Korea, Indonesia, Australia, Saudi Arabia), and two regional organizations: the European Union and the African Union.\nAmong them, \nThe European Union has 27 member countries: Austria, Belgium, Bulgaria, Cyprus, Czech Republic, Croatia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Romania, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Slovakia, Slovenia, Spain, and Sweden.\nThe African Union consists of 55 African countries: Algeria, Egypt, Ethiopia, Angola, Benin, Botswana, Burkina Faso, Burundi, Equatorial Guinea, Togo, Eritrea, Cape Verde, Gambia, Congo (Brazzaville), Congo (Kinshasa), Djibouti, Guinea, Guinea-Bissau, Ghana, Gabon, Zimbabwe, Cameroon, Comoros, Côte d'Ivoire, Kenya, Lesotho, Liberia, Libya, Rwanda, Madagascar, Malawi, Mali, Mauritius, Mauritania, Mozambique, Namibia, South Africa, Niger, Nigeria, Sierra Leone, Senegal, Seychelles, São Tomé and Príncipe, Eswatini, Sudan, Somalia, Tanzania, Tunisia, Uganda, Zambia, Chad, the Central African Republic, and Morocco.",
    socialStatusInstruction: "Think of this ladder as representing where people stand in our society. At the top of the ladder are the people who are the best off, those who have the most money, most education, and best jobs. At the bottom are the people who are the worst off, those who have me least money, least education, and woist jobs or no job.\nWhere would you place yourself on this ladder?",
    personalInfo: [
      {
        id: "birth_date",
        type: "date",
        label: "Date of Birth",
        required: true
      },
      {
        id: "gender",
        type: "single_choice",
        label: "Gender",
        options: ["Male", "Female", "Other"],
        required: true
      },
      {
        id: "education",
        type: "single_choice",
        label: "Education Level",
        options: ["Primary School", "Junior High", "High School", "University", "Master's", "Doctorate"],
        required: true
      },
      {
        id: "second_languages",
        type: "number",
        label: "Number of Second Languages for Daily Communication",
        required: true
      },
      {
        id: "social_status",
        type: "scale",
        label: "Subjective Social Status",
        min: 1,
        max: 10,
        required: true
      }
    ],
    sliderPrompt: "Please rate the similarity between the following two countries on a scale of 0% to 100% based on your subjective impression: ",
    sliderPairs: [
      "Argentina and Australia", "Argentina and Brazil", "Argentina and Canada", "Argentina and China", "Argentina and France", "Argentina and Germany", "Argentina and India", "Argentina and Indonesia", "Argentina and Italy", "Argentina and Japan", "Argentina and Mexico", "Argentina and Russia", "Argentina and Saudi Arabia", "Argentina and South Africa", "Argentina and South Korea", "Argentina and Turkey", "Argentina and the United Kingdom", "Argentina and the United States",
      "Australia and Brazil", "Australia and Canada", "Australia and China", "Australia and France", "Australia and Germany", "Australia and India", "Australia and Indonesia", "Australia and Italy", "Australia and Japan", "Australia and Mexico", "Australia and Russia", "Australia and Saudi Arabia", "Australia and South Africa", "Australia and South Korea", "Australia and Turkey", "Australia and the United Kingdom", "Australia and the United States",
      "Brazil and Canada", "Brazil and China", "Brazil and France", "Brazil and Germany", "Brazil and India", "Brazil and Indonesia", "Brazil and Italy", "Brazil and Japan", "Brazil and Mexico", "Brazil and Russia", "Brazil and Saudi Arabia", "Brazil and South Africa", "Brazil and South Korea", "Brazil and Turkey", "Brazil and the United Kingdom", "Brazil and the United States",
      "Canada and China", "Canada and France", "Canada and Germany", "Canada and India", "Canada and Indonesia", "Canada and Italy", "Canada and Japan", "Canada and Mexico", "Canada and Russia", "Canada and Saudi Arabia", "Canada and South Africa", "Canada and South Korea", "Canada and Turkey", "Canada and the United Kingdom", "Canada and the United States",
      "China and France", "China and Germany", "China and India", "China and Indonesia", "China and Italy", "China and Japan", "China and Mexico", "China and Russia", "China and Saudi Arabia", "China and South Africa", "China and South Korea", "China and Turkey", "China and the United Kingdom", "China and the United States",
      "France and Germany", "France and India", "France and Indonesia", "France and Italy", "France and Japan", "France and Mexico", "France and Russia", "France and Saudi Arabia", "France and South Africa", "France and South Korea", "France and Turkey", "France and the United Kingdom", "France and the United States",
      "Germany and India", "Germany and Indonesia", "Germany and Italy", "Germany and Japan", "Germany and Mexico", "Germany and Russia", "Germany and Saudi Arabia", "Germany and South Africa", "Germany and South Korea", "Germany and Turkey", "Germany and the United Kingdom", "Germany and the United States",
      "India and Indonesia", "India and Italy", "India and Japan", "India and Mexico", "India and Russia", "India and Saudi Arabia", "India and South Africa", "India and South Korea", "India and Turkey", "India and the United Kingdom", "India and the United States",
      "Indonesia and Italy", "Indonesia and Japan", "Indonesia and Mexico", "Indonesia and Russia", "Indonesia and Saudi Arabia", "Indonesia and South Africa", "Indonesia and South Korea", "Indonesia and Turkey", "Indonesia and the United Kingdom", "Indonesia and the United States",
      "Italy and Japan", "Italy and Mexico", "Italy and Russia", "Italy and Saudi Arabia", "Italy and South Africa", "Italy and South Korea", "Italy and Turkey", "Italy and the United Kingdom", "Italy and the United States",
      "Japan and Mexico", "Japan and Russia", "Japan and Saudi Arabia", "Japan and South Africa", "Japan and South Korea", "Japan and Turkey", "Japan and the United Kingdom", "Japan and the United States",
      "Mexico and Russia", "Mexico and Saudi Arabia", "Mexico and South Africa", "Mexico and South Korea", "Mexico and Turkey", "Mexico and the United Kingdom", "Mexico and the United States",
      "Russia and Saudi Arabia", "Russia and South Africa", "Russia and South Korea", "Russia and Turkey", "Russia and the United Kingdom", "Russia and the United States",
      "Saudi Arabia and South Africa", "Saudi Arabia and South Korea", "Saudi Arabia and Turkey", "Saudi Arabia and the United Kingdom", "Saudi Arabia and the United States",
      "South Africa and South Korea", "South Africa and Turkey", "South Africa and the United Kingdom", "South Africa and the United States",
      "South Korea and Turkey", "South Korea and the United Kingdom", "South Korea and the United States",
      "Turkey and the United Kingdom", "Turkey and the United States",
      "The United Kingdom and the United States"
    ],
    sliderPairs_U: [      "Argentina and Australia", "Argentina and Brazil", "Argentina and Canada", "Argentina and China", "Argentina and France", "Argentina and Germany", "Argentina and India", "Argentina and Indonesia", "Argentina and Italy", "Argentina and Japan", "Argentina and Mexico", "Argentina and Russia", "Argentina and Saudi Arabia", "Argentina and South Africa", "Argentina and South Korea", "Argentina and Turkey", "Argentina and the United Kingdom", "Argentina and the United States", "Argentina and the African Union", "Argentina and the European Union",
      "Australia and Brazil", "Australia and Canada", "Australia and China", "Australia and France", "Australia and Germany", "Australia and India", "Australia and Indonesia", "Australia and Italy", "Australia and Japan", "Australia and Mexico", "Australia and Russia", "Australia and Saudi Arabia", "Australia and South Africa", "Australia and South Korea", "Australia and Turkey", "Australia and the United Kingdom", "Australia and the United States", "Australia and the African Union", "Australia and the European Union",
      "Brazil and Canada", "Brazil and China", "Brazil and France", "Brazil and Germany", "Brazil and India", "Brazil and Indonesia", "Brazil and Italy", "Brazil and Japan", "Brazil and Mexico", "Brazil and Russia", "Brazil and Saudi Arabia", "Brazil and South Africa", "Brazil and South Korea", "Brazil and Turkey", "Brazil and the United Kingdom", "Brazil and the United States", "Brazil and the African Union", "Brazil and the European Union",
      "Canada and China", "Canada and France", "Canada and Germany", "Canada and India", "Canada and Indonesia", "Canada and Italy", "Canada and Japan", "Canada and Mexico", "Canada and Russia", "Canada and Saudi Arabia", "Canada and South Africa", "Canada and South Korea", "Canada and Turkey", "Canada and the United Kingdom", "Canada and the United States", "Canada and the African Union", "Canada and the European Union",
      "China and France", "China and Germany", "China and India", "China and Indonesia", "China and Italy", "China and Japan", "China and Mexico", "China and Russia", "China and Saudi Arabia", "China and South Africa", "China and South Korea", "China and Turkey", "China and the United Kingdom", "China and the United States", "China and the African Union", "China and the European Union",
      "France and Germany", "France and India", "France and Indonesia", "France and Italy", "France and Japan", "France and Mexico", "France and Russia", "France and Saudi Arabia", "France and South Africa", "France and South Korea", "France and Turkey", "France and the United Kingdom", "France and the United States", "France and the African Union", "France and the European Union",
      "Germany and India", "Germany and Indonesia", "Germany and Italy", "Germany and Japan", "Germany and Mexico", "Germany and Russia", "Germany and Saudi Arabia", "Germany and South Africa", "Germany and South Korea", "Germany and Turkey", "Germany and the United Kingdom", "Germany and the United States", "Germany and the African Union", "Germany and the European Union",
      "India and Indonesia", "India and Italy", "India and Japan", "India and Mexico", "India and Russia", "India and Saudi Arabia", "India and South Africa", "India and South Korea", "India and Turkey", "India and the United Kingdom", "India and the United States", "India and the African Union", "India and the European Union",
      "Indonesia and Italy", "Indonesia and Japan", "Indonesia and Mexico", "Indonesia and Russia", "Indonesia and Saudi Arabia", "Indonesia and South Africa", "Indonesia and South Korea", "Indonesia and Turkey", "Indonesia and the United Kingdom", "Indonesia and the United States", "Indonesia and the African Union", "Indonesia and the European Union",
      "Italy and Japan", "Italy and Mexico", "Italy and Russia", "Italy and Saudi Arabia", "Italy and South Africa", "Italy and South Korea", "Italy and Turkey", "Italy and the United Kingdom", "Italy and the United States", "Italy and the African Union", "Italy and the European Union",
      "Japan and Mexico", "Japan and Russia", "Japan and Saudi Arabia", "Japan and South Africa", "Japan and South Korea", "Japan and Turkey", "Japan and the United Kingdom", "Japan and the United States", "Japan and the African Union", "Japan and the European Union",
      "Mexico and Russia", "Mexico and Saudi Arabia", "Mexico and South Africa", "Mexico and South Korea", "Mexico and Turkey", "Mexico and the United Kingdom", "Mexico and the United States", "Mexico and the African Union", "Mexico and the European Union",
      "Russia and Saudi Arabia", "Russia and South Africa", "Russia and South Korea", "Russia and Turkey", "Russia and the United Kingdom", "Russia and the United States", "Russia and the African Union", "Russia and the European Union",
      "Saudi Arabia and South Africa", "Saudi Arabia and South Korea", "Saudi Arabia and Turkey", "Saudi Arabia and the United Kingdom", "Saudi Arabia and the United States", "Saudi Arabia and the African Union", "Saudi Arabia and the European Union",
      "South Africa and South Korea", "South Africa and Turkey", "South Africa and the United Kingdom", "South Africa and the United States", "South Africa and the African Union", "South Africa and the European Union",
      "South Korea and Turkey", "South Korea and the United Kingdom", "South Korea and the United States", "South Korea and the African Union", "South Korea and the European Union",
      "Turkey and the United Kingdom", "Turkey and the United States", "Turkey and the African Union", "Turkey and the European Union",
      "The United Kingdom and the United States", "The United Kingdom and the African Union", "The United Kingdom and the European Union",
      "The United States and the African Union", "The United States and the European Union",
      "The African Union and the European Union"],
    multipleChoicePrompt: "What factors do you primarily use to assess the similarity rating of {pair}?",
    multipleChoiceOptions: [
      "Geographical Location", "Climate Conditions", "Historical Background", "Language and Culture", "Economic Structure", "Political System", "Level of Technology", "Social Composition", "International Relations", "Lifestyle"
    ],
    longTextPrompt: "Overall, how do you think about evaluating the similarity between two countries? (It’s recommended to use voice recognition for a more conversational expression.)",
    buttons: {
      next: "Next",
      submit: "Submit"
    },
    endPage: {
      paymentInstruction: "Please scan the QR code below or click the link to enter the payment platform. Enter your Unique ID (UUID) and wait for manual verification. Payment will be issued after verification.",
      paymentLinkText: "Click here to enter payment platform",
      paymentLink: "https://www.wenjuan.com/s/NJj63ma/" // Placeholder
    }
  }
};
