// Toàn bộ nội dung lấy từ "Kế hoạch website Tỉnh Lướt". Sửa chữ ở đây, không cần đụng component.

export const SLOGAN = "Tỉnh táo khi lướt – Tôn trọng khi khác biệt";

/** Link bộ câu hỏi Blooket 100 câu. Để trống thì nút bị ẩn. */
export const BLOOKET_URL = "";

export const STEPS = [
  { id: "mo-dau", label: "Mở đầu" },
  { id: "hieu-dung", label: "Hiểu đúng" },
  { id: "luot-thu", label: "Lướt thử" },
  { id: "phan-loai", label: "Phân loại" },
  { id: "viet-nam", label: "Việt Nam" },
  { id: "cam-ket", label: "Cam kết" },
] as const;

/** Tiêu đề giật gân trôi trên "lớp ồn". */
export const NOISE_HEADLINES = [
  "SỐC!!!", "CHIA SẺ NGAY", "THẦY A GIẢI HẠN", "TẬN THẾ RỒI", "BỊ CẤM!!!", "XÚC PHẠM",
  "KHẨN CẤP", "XEM TRƯỚC KHI BỊ XÓA", "CHUYỂN KHOẢN LÀ KHỎI", "KHÔNG THỂ TIN NỔI",
  "AI CŨNG PHẢI BIẾT", "SỰ THẬT BỊ GIẤU", "SHARE MẠNH", "100% CÓ THẬT",
];

export type FlipGroup = { group: string; cards: { q: string; a: string }[] };

export const FLIPS: FlipGroup[] = [
  { group: "Bản chất", cards: [
    { q: "Tôn giáo là gì?", a: "Hình thái ý thức xã hội phản ánh hư ảo hiện thực khách quan." },
    { q: "Ai tạo ra tôn giáo?", a: "Con người. Nhưng rồi con người lại lệ thuộc vào tôn giáo." },
    { q: "Một tôn giáo cần những gì?", a: "5 tiêu chí: niềm tin, giáo lý, cơ sở thờ tự, tổ chức, tín đồ." },
  ] },
  { group: "Nguồn gốc", cards: [
    { q: "Vì sao người xưa thờ thần Sấm?", a: "Nguồn gốc tự nhiên – kinh tế xã hội: bất lực trước thiên nhiên." },
    { q: "Vì sao điều chưa biết sinh ra niềm tin siêu nhiên?", a: "Nguồn gốc nhận thức: khoảng cách giữa “biết” và “chưa biết”." },
    { q: "Vì sao ốm đau người ta hay đi lễ?", a: "Nguồn gốc tâm lý: sợ hãi, mong bình an, lòng biết ơn." },
  ] },
  { group: "Tính chất", cards: [
    { q: "Tôn giáo có thay đổi không?", a: "Tính lịch sử: có hình thành, biến đổi theo điều kiện xã hội." },
    { q: "Có bao nhiêu người theo tôn giáo?", a: "Tính quần chúng: gần 3/4 dân số thế giới." },
    { q: "Tôn giáo có dính đến chính trị không?", a: "Tính chính trị: xuất hiện khi xã hội có giai cấp, tôn giáo có thể bị lợi dụng." },
  ] },
  { group: "Nguyên tắc", cards: [
    { q: "Ai được quyết định bạn theo đạo hay không?", a: "Chỉ bạn. Tôn trọng tự do tín ngưỡng và không tín ngưỡng." },
    { q: "Lợi dụng tôn giáo và niềm tin tôn giáo có giống nhau?", a: "Không. Phải phân biệt mặt chính trị và mặt tư tưởng." },
    { q: "Đánh giá tôn giáo thế nào cho đúng?", a: "Quan điểm lịch sử – cụ thể, và khắc phục tiêu cực gắn với xây dựng xã hội mới." },
  ] },
];

export type Reaction = "like" | "share" | "verify" | "report" | "skip";

export const REACTIONS: { key: Reaction; label: string }[] = [
  { key: "like", label: "Thích" },
  { key: "share", label: "Tin & chia sẻ" },
  { key: "verify", label: "Kiểm chứng" },
  { key: "report", label: "Báo cáo" },
  { key: "skip", label: "Bỏ qua" },
];

/** Cụm từ được Kính Tỉnh đánh dấu. `text` phải xuất hiện nguyên văn trong bài. */
export type Flag = { text: string; note: string; tone: "bad" | "good" };

export type Post = {
  name: string;
  initials: string;
  color: string;
  meta: string;
  text: string;
  kind?: "dm";
  media?: { label: string; caption: string; live?: boolean };
  stats?: [string, string, string];
  flags: Flag[];
  answer: Reaction;
  explain: string;
};

export const POSTS: Post[] = [
  {
    name: "CLB Thiện nguyện Chùa X", initials: "CX", color: "#F6D98B", meta: "2 giờ",
    text: "Sáng nay nhóm phật tử chùa X đã nấu 500 suất cơm cho bệnh nhân nghèo tại bệnh viện tỉnh. Cảm ơn các cô chú đã chung tay!",
    stats: ["2,4K", "186 bình luận", "512 chia sẻ"],
    flags: [
      { text: "500 suất cơm cho bệnh nhân nghèo", note: "việc thiện cụ thể", tone: "good" },
      { text: "chung tay", note: "tinh thần hướng thiện", tone: "good" },
    ],
    answer: "like", explain: "Tôn giáo có giá trị nhân văn, hướng thiện. Mạng xã hội giúp lan tỏa điều tốt.",
  },
  {
    name: "Thầy A – Giải hạn Tâm Linh", initials: "TA", color: "#C9B8F0", meta: "Được tài trợ",
    text: "GIẢI HẠN ONLINE – chỉ cần chuyển khoản 5 TRIỆU, thầy làm lễ từ xa, bệnh nan y cũng khỏi. Inbox ngay kẻo lỡ ngày đẹp!",
    stats: ["891", "1,2K bình luận", "340 chia sẻ"],
    flags: [
      { text: "chuyển khoản 5 TRIỆU", note: "đòi tiền", tone: "bad" },
      { text: "bệnh nan y cũng khỏi", note: "hứa phi khoa học", tone: "bad" },
      { text: "kẻo lỡ ngày đẹp", note: "ép thời gian", tone: "bad" },
    ],
    answer: "report", explain: "Đây là mê tín dị đoan và lợi dụng niềm tin để trục lợi, không phải hoạt động tôn giáo bình thường.",
  },
  {
    name: "Tin Nóng 24h", initials: "TN", color: "#F2A9A0", meta: "1 giờ",
    text: "Không thể tin nổi!!! Tôn giáo X xúc phạm tôn giáo Y. Share mạnh cho mọi người biết!!!",
    media: { label: "VIDEO", caption: "Clip đã bị cắt ghép, không rõ nguồn" },
    stats: ["5,7K", "3,9K bình luận", "2,1K chia sẻ"],
    flags: [
      { text: "Không thể tin nổi!!!", note: "kích động cảm xúc", tone: "bad" },
      { text: "xúc phạm tôn giáo Y", note: "gây chia rẽ", tone: "bad" },
      { text: "Share mạnh", note: "thúc lan truyền", tone: "bad" },
    ],
    answer: "verify", explain: "Nội dung xuyên tạc nhằm chia rẽ. Đây là mặt chính trị, tức mâu thuẫn đối kháng, chứ không phải khác biệt niềm tin.",
  },
  {
    name: "Giáo xứ B", initials: "GB", color: "#A8D5E2", meta: "Đang phát trực tiếp",
    text: "Trực tiếp Thánh lễ đêm Giáng sinh tại nhà thờ giáo xứ B. Kính chúc mọi người một mùa Giáng sinh an lành.",
    media: { label: "TRỰC TIẾP", caption: "Thánh lễ đêm Giáng sinh", live: true },
    stats: ["1,1K", "245 bình luận", "98 chia sẻ"],
    flags: [
      { text: "Thánh lễ đêm Giáng sinh", note: "sinh hoạt hợp pháp", tone: "good" },
      { text: "an lành", note: "lời chúc thiện chí", tone: "good" },
    ],
    answer: "like", explain: "Sinh hoạt tôn giáo bình thường được Nhà nước tôn trọng và bảo hộ.",
  },
  {
    name: "Người lạ", initials: "?", color: "#D6D3D3", meta: "Tin nhắn chờ", kind: "dm",
    text: "SẮP TẬN THẾ rồi bạn ơi. Vào nhóm Z, đóng phí 2 triệu để được cứu. Chỉ còn 3 ngày, đừng nói với gia đình nhé.",
    flags: [
      { text: "SẮP TẬN THẾ", note: "gieo hoang mang", tone: "bad" },
      { text: "đóng phí 2 triệu", note: "thu tiền", tone: "bad" },
      { text: "đừng nói với gia đình", note: "cô lập bạn", tone: "bad" },
    ],
    answer: "report", explain: "Dấu hiệu tà đạo, hiện tượng tôn giáo mới lợi dụng sự hoang mang. Vi phạm pháp luật.",
  },
  {
    name: "Góc Suy Ngẫm", initials: "GS", color: "#B7E4C7", meta: "3 giờ",
    text: "Nói thật: người không theo đạo là người vô đạo đức. Ai phản đối thì comment xem nào!",
    stats: ["642", "2,8K bình luận", "77 chia sẻ"],
    flags: [
      { text: "người không theo đạo là người vô đạo đức", note: "kỳ thị", tone: "bad" },
      { text: "Ai phản đối thì comment", note: "mồi tranh cãi", tone: "bad" },
    ],
    answer: "skip", explain: "Theo hay không theo đạo đều là quyền tự do. Không kỳ thị cả hai phía, và không lao vào bình luận công kích.",
  },
  {
    name: "Tin Tức Mới Nhất", initials: "TM", color: "#F7C59F", meta: "30 phút",
    text: "KHẨN: Nhà nước cấm mọi người đi lễ chùa từ tháng sau! Chia sẻ ngay cho người thân biết!",
    stats: ["3,3K", "1,5K bình luận", "4,6K chia sẻ"],
    flags: [
      { text: "KHẨN", note: "giật tít", tone: "bad" },
      { text: "cấm mọi người đi lễ chùa", note: "trái chính sách thật", tone: "bad" },
      { text: "Chia sẻ ngay", note: "thúc lan truyền", tone: "bad" },
    ],
    answer: "verify", explain: "Sai sự thật. Chính sách nhất quán là tôn trọng, bảo đảm quyền tự do tín ngưỡng. Hãy kiểm tra trên cổng thông tin chính thống.",
  },
  {
    name: "Du lịch Việt", initials: "DV", color: "#E5FD54", meta: "Hôm qua",
    text: "Giỗ Tổ Hùng Vương mùng 10/3 – về Phú Thọ dự lễ hội đền Hùng, hướng về cội nguồn dân tộc.",
    media: { label: "CLIP", caption: "Lễ hội đền Hùng" },
    stats: ["8,9K", "412 bình luận", "1,7K chia sẻ"],
    flags: [
      { text: "Giỗ Tổ Hùng Vương", note: "thờ cúng tổ tiên", tone: "good" },
      { text: "hướng về cội nguồn dân tộc", note: "gắn kết cộng đồng", tone: "good" },
    ],
    answer: "like", explain: "Tín ngưỡng thờ cúng tổ tiên, Vua Hùng là sợi dây gắn kết cộng đồng dân tộc.",
  },
];

export const MAX_SCORE = POSTS.length * 10;

export function verdict(score: number) {
  if (score >= 70) return { title: "Người lướt tỉnh táo", tone: "lime", msg: "Bạn tách bạch được niềm tin chân chính với hành vi lợi dụng tôn giáo." } as const;
  if (score >= 40) return { title: "Cần cẩn thận hơn", tone: "amber", msg: "Đúng nhiều, nhưng vẫn có lúc phản ứng theo cảm xúc. Chậm lại trước khi bấm." } as const;
  return { title: "Dễ bị dắt mũi", tone: "red", msg: "Thông tin sai lệch dễ khiến bạn tin và chia sẻ. Lướt lại để luyện thêm nhé." } as const;
}

export type Bin = "tn" | "tg" | "mt";

export const BINS: { key: Bin; label: string; def: string }[] = [
  { key: "tn", label: "Tín ngưỡng", def: "Niềm tin của con người vào cái thiêng liêng, cao cả, siêu nhiên, thể hiện qua hành vi, nghi lễ thờ cúng gắn với phong tục, tập quán truyền thống để mang lại sự bình an về tinh thần." },
  { key: "tg", label: "Tôn giáo", def: "Hình thái ý thức xã hội phản ánh hư ảo hiện thực khách quan; là thực thể xã hội có niềm tin, giáo lý, cơ sở thờ tự, tổ chức và tín đồ." },
  { key: "mt", label: "Mê tín dị đoan", def: "Niềm tin mê muội, viển vông, không dựa trên cơ sở khoa học, dẫn đến hành vi cực đoan, sai lệch quá mức, gây tổn hại cho cá nhân, gia đình và cộng đồng." },
];

export const CHIPS: { text: string; bin: Bin }[] = [
  { text: "Thờ cúng tổ tiên", bin: "tn" },
  { text: "Phật giáo", bin: "tg" },
  { text: "Bỏ thuốc, chữa bệnh bằng bùa", bin: "mt" },
  { text: "Thờ Mẫu", bin: "tn" },
  { text: "Công giáo", bin: "tg" },
  { text: "Đốt vàng mã quá mức, tốn kém", bin: "mt" },
  { text: "Thờ thành hoàng làng", bin: "tn" },
  { text: "Cao Đài", bin: "tg" },
  { text: "Cúng giải hạn online chuyển khoản", bin: "mt" },
];

export const TRAITS = [
  "Nhiều tôn giáo.",
  "Đa dạng, chung sống hòa bình, không có chiến tranh tôn giáo.",
  "Tín đồ phần lớn là nhân dân lao động yêu nước.",
  "Chức sắc có uy tín với tín đồ.",
  "Có quan hệ với tôn giáo nước ngoài.",
];

export const POLICIES = [
  "Tôn giáo là nhu cầu tinh thần, tồn tại lâu dài.",
  "Đại đoàn kết dân tộc.",
  "Công tác vận động quần chúng là cốt lõi.",
  "Công tác tôn giáo là trách nhiệm của cả hệ thống chính trị.",
  "Theo đạo, truyền đạo phải tuân thủ pháp luật.",
];

export const TIMELINE = [
  { year: "2003", text: "Nghị quyết 25-NQ/TW về công tác tôn giáo" },
  { year: "2013", text: "Hiến pháp 2013" },
  { year: "2018", text: "Luật Tín ngưỡng, tôn giáo có hiệu lực" },
  { year: "2019", text: "Luật An ninh mạng có hiệu lực" },
];

/** "5 không": mỗi dòng là một thói quen đang BẬT, người xem tắt nó đi để cam kết. */
export const PLEDGES = [
  { on: "Tin ngay", off: "Không tin ngay" },
  { on: "Chia sẻ ngay", off: "Không chia sẻ ngay" },
  { on: "Xuyên tạc", off: "Không xuyên tạc" },
  { on: "Kỳ thị", off: "Không kỳ thị" },
  { on: "Tiếp tay cho tin sai lệch", off: "Không tiếp tay cho thông tin sai lệch" },
];
