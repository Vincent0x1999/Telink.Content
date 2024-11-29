const Dictionary = {
  Tag: {
    Activity: "ACT",
    Advertiser: "ADV",
    UserApplication: "APL",
    UserAction: "ATN",
    FundingLog: "FLG",
    PointLogUser: "PGU",
    PointLogActivity: "PGA",
    PointLogAdvertiser: "PAD",
    UserInfoAddress: "ADR"
  },
  Activity: {
    State: {
      Normal: 0,
      Finish: 1,
      Pause: 4
    },
    Category: {
      DailyCheckIn: "DailyCheckIn",
      Share: "Share",
      Ad: "Ad",
      Lotter: "Lotter",
      Task: "Task"
    },
    Prgress: {
      Process: 0,
      Awarded: 1,
      UnDrawn: 2
    },
    Action: {
      JoinIn: "JoinIn",
      Assist: "Assist",
      WinReward: "WinReward",
      WinCurrency: "WinCurrency",
      WinGoods: "WinGoods",
      TopUp: "TopUp",
      PaymentToJoinIn: "PaymentToJoinIn",
      PaymentToAssist: "PaymentToAssist",
      PageView: "PageView",
      WaitingTime: "WaitingTime",
      Submit: "Submit",
      Share: "Share",
      Download: "Download",
      Register: "Register",
      CheckIn: "CheckIn",
      ReadArticleSeconds: "ReadArticleSeconds",
      JoinChannel: "JoinChannel",
      JoinGroup: "JoinGroup",
      Win: "Win",
      DoTask: "DoTask",
      DrawWinners: "DrawWinners"
    },
    RepeatType: {
      EveryDay: "EveryDay",
      Total: "Total"
    },
    FinishType: {
      ByTime: "ByTime",
      ByPeopleNum: "ByPeopleNum"
    },
    DrawWinnerType: {
      Random: "Random",
      Rank: "Rank"
    },
    Prize: {
      Type: {
        Currency: "Currency",
        PhysicalGoods: "PhysicalGoods",
        VirtualGoods: "VirtualGoods",
        Coupon: "Coupon"
      },
      ReceiveType: {
        Currency_Lucky: "Currency_Lucky",
        Currency_Equal: "Currency_Equal",
        PhysicalGoods_Delivery: "PhysicalGoods_Delivery",
        PhysicalGoods_ContactMe: "PhysicalGoods_ContactMe",
        VirtualGoods_AutoIssue: "VirtualGoods_AutoIssue",
        ContactUs: "ContactUs"
      }
    }
  },
  Currency: {
    Type: {
      Point: "Point",
      Crypto: "Crypto",
      Fiat: "Fiat",
      Stars: "Stars"
    },
    Rate: {
      PointToUSD: 100,
      StarsToUSD: 50
    }
  },
  Log: {
    Type: {
      ActivityAward: "ActivityAward",
      UserWithdraw: "UserWithdraw",
      UserRecharge: "UserRecharge",
      ActivityConsume: "ActivityConsume",
      PaymentToJoinIn: "PaymentToJoinIn"
    }
  },
  Application: {
    State: {
      Pending: 0,
      Success: 1,
      Fail: 2
    }
  },
  User: {
    InfoCategory: {
      Address: "Address"
    }
  },
  Crypto: {
    Network: {
      Ton: "Ton"
    },
    Token: {
      USDT: "USDT"
    }
  },
  Setting: {
    ShareLink: "{miniapp_home}?startapp={page}_{category}-{activity_id}_{userid}"
  }
};