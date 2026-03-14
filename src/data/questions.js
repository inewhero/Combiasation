const buildPairs = (countries, joiner) => {
  const pairs = [];
  for (let i = 0; i < countries.length; i++) {
    for (let j = i + 1; j < countries.length; j++) {
      pairs.push(`${countries[i]}${joiner}${countries[j]}`)
    }
  }
  return pairs
}

const countriesZh = [
  "阿根廷", "澳大利亚", "巴西", "加拿大", "中国", "法国", "德国", "印度", "印度尼西亚", "意大利",
  "日本", "墨西哥", "俄罗斯", "沙特阿拉伯", "南非", "韩国", "土耳其", "英国", "美国", "乌克兰", "以色列", "伊拉克", "伊朗"
]

const countriesEn = [
  "Argentina", "Australia", "Brazil", "Canada", "China", "France", "Germany", "India", "Indonesia", "Italy",
  "Japan", "Mexico", "Russia", "Saudi Arabia", "South Africa", "South Korea", "Turkey", "the United Kingdom", "the United States", "Ukraine", "Israel", "Iraq", "Iran"
]

export const surveyData = {
  zh: {
    locale: "zh",
    title: "国家相似度调查",
    intro: "这是一项完全匿名的研究，需要您根据自己的主观印象对多个国家进行“相似度”评价，0%代表非常不相似，100%代表非常相似。\n参与本实验可能需要花费15分钟左右的时间，待结果审核后您将获得5-10元范围的随机报酬。感谢您愿意抽出宝贵时间来参加本次答题，现在我们就马上开始吧！",
    consent: {
      text: "知情同意书\n\n本研究旨在调查人们对不同国家相似度的看法。您的参与完全自愿，您可以随时退出研究而不受任何惩罚。您的回答将完全匿名，仅用于学术研究。\n\n如果您同意参与本研究，请点击下方的“同意”按钮。",
      agree: "同意",
      disagree: "不同意"
    },
    info: `本研究将邀请您评估以下国家之间的相似度：${countriesZh.join("、")}。`,
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
    startButton: "开始答题",
    endPage: {
      thankYou: "感谢您的参与！",
      submitted: "您的回答已成功提交。",
      uuidLabel: "您的唯一ID (请保存以便领取报酬):",
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
    sliderPairs: buildPairs(countriesZh, " 和 "),
    multipleChoicePrompt: "您对 {pair} 相似性的评分主要基于以下哪些因素来判断？",
    multipleChoiceOptions: [
      "地理位置", "气候条件", "历史背景", "语言文化", "经济结构", "政治体系", "科技水平", "社会组成", "国际关系", "生活方式"
    ],
    longTextPrompt: "总的来说，您在评价两个国家的相似性时会以怎样的方式思考？（建议使用语音识别输入口语化的表达）"
  },
  en: {
    locale: "en",
    title: "Country Similarity Survey",
    intro: "This is a completely anonymous study that asks you to evaluate the \"similarity\" between multiple countries based on your subjective impressions. 0% represents very dissimilar, and 100% represents very similar. Participating in this experiment may take about 15 minutes. After the results are reviewed, you will receive a random reward ranging from 5 to 10 yuan. Thank you for taking the time to participate in this survey. Let's get started!",
    consent: {
      text: "Informed Consent\n\nThis study aims to investigate perceptions of similarity between different countries. Your participation is completely voluntary, and you may withdraw at any time without penalty. Your responses will be completely anonymous and used for academic research purposes only.\n\nIf you agree to participate in this study, please click the \"Agree\" button below.",
      agree: "Agree",
      disagree: "Disagree"
    },
    info: `In this study, you will evaluate perceived similarity among the following countries: ${countriesEn.join(", ")}.`,
    socialStatusInstruction: "Think of this ladder as representing where people stand in our society. At the top are people who are best off, with the most money, most education, and best jobs. At the bottom are people who are worst off, with the least money, least education, and worst jobs or no job.\nWhere would you place yourself on this ladder?",
    socialStatusLabels: {
      best: "Best off",
      worst: "Worst off"
    },
    sliderLabels: {
      dissimilar: "0% (Dissimilar)",
      similar: "100% (Similar)"
    },
    buttons: {
      next: "Next",
      submit: "Submit"
    },
    startButton: "Start Survey",
    endPage: {
      thankYou: "Thank You!",
      submitted: "Your response has been successfully submitted.",
      uuidLabel: "Your Unique ID (Please save for reward):",
      paymentInstruction: "Please scan the QR code below or click the link to enter the payment platform. Enter your Unique ID (UUID) and wait for manual verification. Payment will be issued after verification.",
      paymentLinkText: "Click here to enter payment platform",
      paymentLink: "https://www.wenjuan.com/s/NJj63ma/"
    },
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
    sliderPairs: buildPairs(countriesEn, " and "),
    multipleChoicePrompt: "What factors do you primarily use to assess the similarity rating of {pair}?",
    multipleChoiceOptions: [
      "Geographical Location", "Climate Conditions", "Historical Background", "Language and Culture", "Economic Structure", "Political System", "Level of Technology", "Social Composition", "International Relations", "Lifestyle"
    ],
    longTextPrompt: "Overall, how do you think about evaluating the similarity between two countries? (It's recommended to use voice recognition for a more conversational expression.)"
  }
}
