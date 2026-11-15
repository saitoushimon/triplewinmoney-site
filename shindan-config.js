"use strict";

// Add another key here to support a URL such as ?type=hotel.
window.shindanConfigs = {
  general: {
    choices: [
      { label: "できている / はい", points: 0 },
      { label: "一部だけ / あいまい", points: 1 },
      { label: "できていない / わからない", points: 2 }
    ],
    ranks: [
      { id: "A", label: "ランクA", max: 2 },
      { id: "B", label: "ランクB", max: 6 },
      { id: "C", label: "ランクC", max: 10 }
    ],
    adviceLimit: 3,
    axes: {
      A: {
        label: "お金のムダ度",
        mailLabel: "A軸: お金のムダ度",
        comments: {
          A: "見直しの余地は小さめです。ITの支出をよく把握できています。年に1回の定期点検で、この状態を保てます。",
          B: "見直しの余地があります。契約内容を把握しきれていない項目があり、気づかないうちに払い続けている費用があるかもしれません。",
          C: "見直しの余地が大きい状態です。契約の全体像が見えていないため、まずは「何に、毎月いくら払っているか」の一覧づくりから始めることをおすすめします。"
        }
      },
      B: {
        label: "危険度",
        mailLabel: "B軸: 危険度",
        comments: {
          A: "基本的な対策ができています。この状態を続けられるよう、担当者と確認の頻度を決めておくと安心です。",
          B: "対策に抜けがあります。大きな事故の多くは、こうした「一部だけできている」部分から起きます。抜けている項目から順に手当てしましょう。",
          C: "早めの対策をおすすめします。基本的な対策が複数抜けており、情報漏えいやデータ消失が起きた場合に業務が止まるおそれがあります。"
        }
      }
    },
    questions: [
      {
        axis: "A",
        title: "ITにかかる毎月の支払い総額を、すぐに答えられますか",
        advice: "請求書を1か月分集めて合計するだけで、全体像が見えます。"
      },
      {
        axis: "A",
        title: "電話・インターネット回線の契約を、この3年以内に見直しましたか",
        advice: "回線の料金プランは数年で大きく変わります。同じ使い方でも下がる場合があります。"
      },
      {
        axis: "A",
        title: "複合機のリース料と、印刷1枚あたりの料金を把握していますか",
        advice: "複合機は、リース料より印刷1枚あたりの料金で差が出やすい契約です。"
      },
      {
        axis: "A",
        title: "月額払いのソフトやサービスを、一覧にして管理していますか",
        advice: "一覧がないと、解約もれと二重契約に気づけません。"
      },
      {
        axis: "A",
        title: "契約したまま使っていないソフトやサービスはありますか",
        advice: "使っていない契約は、止めるだけで毎月の固定費が下がります。",
        choices: [
          { label: "ない", points: 0 },
          { label: "たぶんある", points: 1 },
          { label: "ある・わからない", points: 2 }
        ]
      },
      {
        axis: "B",
        title: "退職した人のアカウントを、退職日に停止していますか",
        advice: "退職者のアカウントは、情報漏えいの入口になりやすい場所です。"
      },
      {
        axis: "B",
        title: "パスワードの使い回しや、付箋・共有ファイルでの管理をやめられていますか",
        advice: "パスワードの使い回しは、1か所の漏えいが全体に広がる原因になります。"
      },
      {
        axis: "B",
        title: "メールや主要なサービスに、2段階認証を設定していますか",
        advice: "2段階認証は、費用をかけずにできる効果の高い対策です。"
      },
      {
        axis: "B",
        title: "データのバックアップを取り、元に戻せることを確認したことがありますか",
        advice: "バックアップは「取っている」だけでなく「戻せる」ことの確認が大切です。"
      },
      {
        axis: "B",
        title: "パソコンの更新(アップデート)とウイルス対策を、全台で確認していますか",
        advice: "更新が止まったパソコンが1台あるだけで、社内全体の弱点になります。"
      }
    ],
    resultNotes: [
      "本診断は簡易的な自己チェックであり、結果は目安です。",
      "セキュリティに関する質問は、IPA(独立行政法人情報処理推進機構)「中小企業の情報セキュリティ対策ガイドライン」を参考に作成しています。"
    ],
    referenceUrl: "https://www.ipa.go.jp/security/guide/sme/5minutes.html",
    contact: {
      recipient: "info@triplewinmoney.com",
      privacyUrl: "./privacy.html",
      subject: "IT健康診断 無料オンライン解説の希望",
      fields: [
        { name: "company", label: "会社名", type: "text", autocomplete: "organization", required: true, maxLength: 120 },
        { name: "name", label: "お名前", type: "text", autocomplete: "name", required: true, maxLength: 80 },
        { name: "email", label: "メールアドレス", type: "email", autocomplete: "email", required: true, maxLength: 254 },
        { name: "phone", label: "電話番号", type: "tel", autocomplete: "tel", maxLength: 40 },
        { name: "message", label: "ご相談内容", type: "textarea", maxLength: 500 }
      ]
    },
    copy: {
      start: "診断をはじめる",
      back: "戻る",
      result: "診断結果",
      advice: "一言アドバイス",
      cta: "改善案を受け取る(無料・オンライン30分)",
      contact: "無料オンライン解説のお申し込み",
      required: "必須",
      optional: "任意",
      missingField: "入力してください。",
      invalidEmail: "メールアドレスの形式を確認してください。",
      privacy: "プライバシーポリシー",
      privacyNotice: "ご入力いただいた情報は、診断結果のご説明とご連絡のためにのみ利用します",
      submit: "申込メールを作成する",
      submitError: "メールアプリを開けませんでした。下の宛先とメール内容を使ってお申し込みください。",
      draft: "メールの送信をお願いします",
      draftInstructions: "お申し込みはまだ完了していません。メールアプリに作成された下書きを送信してください。開かなかった場合は、下の内容をコピーして宛先へお送りください。",
      recipient: "宛先",
      draftLabel: "メールの件名・本文",
      copy: "メール内容をコピー",
      copied: "メール内容をコピーしました。",
      copyError: "コピーできませんでした。上の内容を選択してコピーしてください。",
      edit: "入力内容を修正する",
      subject: "件名"
    }
  }
};
