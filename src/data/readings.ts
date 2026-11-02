/**
 * Mass readings by date. Key = "YYYY-MM-DD" (local date).
 * color: "green" | "violet" | "white" | "red" | "rose" (overrides the season color for that day)
 * readings: list of { label, citation } in the order they are proclaimed.
 * Days missing here fall back to a generic weekday entry.
 */
import type { LitColor } from "@/lib/liturgy";

export interface MassDay {
  celebration: string;
  color?: LitColor;
  summary: string;
  readings: { label: string; citation: string }[];
}

export const READINGS: Record<string, MassDay> = {
  "2026-11-01": {
    celebration: "Solemnity of All Saints",
    color: "white",
    summary:
      "The Church rejoices in the great multitude of holy men and women, known and unknown, who now see God face to face. The Beatitudes show the path they walked, and we are invited to walk it too.",
    readings: [
      { label: "First Reading", citation: "Revelation 7:2-4, 9-14" },
      { label: "Psalm", citation: "Psalm 24:1-6" },
      { label: "Second Reading", citation: "1 John 3:1-3" },
      { label: "Gospel", citation: "Matthew 5:1-12a" },
    ],
  },
  "2026-11-02": {
    celebration: "Commemoration of All the Faithful Departed (All Souls)",
    color: "violet",
    summary:
      "We pray for all who have died in Christ and are being purified for heaven. Christ promises that he will lose none of those the Father has given him, and we entrust our loved ones to his mercy.",
    readings: [
      { label: "First Reading", citation: "Wisdom 3:1-9" },
      { label: "Psalm", citation: "Psalm 23" },
      { label: "Second Reading", citation: "Romans 5:5-11" },
      { label: "Gospel", citation: "John 6:37-40" },
    ],
  },
  "2026-11-03": {
    celebration: "Tuesday of the 31st Week in Ordinary Time",
    summary:
      "Saint Paul sings of Christ who emptied himself and became obedient unto death. In the Gospel, the master's banquet is opened to the poor and the forgotten when the invited guests make excuses.",
    readings: [
      { label: "First Reading", citation: "Philippians 2:5-11" },
      { label: "Psalm", citation: "Psalm 22:26b-32" },
      { label: "Gospel", citation: "Luke 14:15-24" },
    ],
  },
  "2026-11-04": {
    celebration: "Memorial of Saint Charles Borromeo, Bishop",
    color: "white",
    summary:
      "Paul urges us to work out our salvation with fear and trembling, shining like lights in the world. Jesus asks his followers to count the cost of discipleship and carry their cross.",
    readings: [
      { label: "First Reading", citation: "Philippians 2:12-18" },
      { label: "Psalm", citation: "Psalm 27:1, 4, 13-14" },
      { label: "Gospel", citation: "Luke 14:25-33" },
    ],
  },
  "2026-11-05": {
    celebration: "Thursday of the 31st Week in Ordinary Time",
    summary:
      "Paul counts everything as loss compared to knowing Christ. Jesus tells of the shepherd who seeks the lost sheep and the woman who searches for her lost coin: heaven rejoices over one sinner who repents.",
    readings: [
      { label: "First Reading", citation: "Philippians 3:3-8a" },
      { label: "Psalm", citation: "Psalm 105:2-7" },
      { label: "Gospel", citation: "Luke 15:1-10" },
    ],
  },
  "2026-11-06": {
    celebration: "Friday of the 31st Week in Ordinary Time",
    summary:
      "Our citizenship is in heaven, Paul reminds us, and we await a Savior. Jesus praises the prudence of a dishonest steward to teach us to use this world's goods wisely for the Kingdom.",
    readings: [
      { label: "First Reading", citation: "Philippians 3:17–4:1" },
      { label: "Psalm", citation: "Psalm 122:1-5" },
      { label: "Gospel", citation: "Luke 16:1-8" },
    ],
  },
  "2026-11-07": {
    celebration: "Saturday of the 31st Week in Ordinary Time",
    summary:
      "Paul has learned to be content in every circumstance through Christ who strengthens him. Jesus warns that no one can serve two masters: we cannot serve both God and money.",
    readings: [
      { label: "First Reading", citation: "Philippians 4:10-19" },
      { label: "Psalm", citation: "Psalm 112:1b-2, 5-6, 8a, 9" },
      { label: "Gospel", citation: "Luke 16:9-15" },
    ],
  },
  "2026-11-08": {
    celebration: "Thirty-second Sunday in Ordinary Time",
    summary:
      "Wisdom is found by those who seek her. In the parable of the ten virgins, Jesus calls us to keep our lamps burning, for we know neither the day nor the hour of his coming.",
    readings: [
      { label: "First Reading", citation: "Wisdom 6:12-16" },
      { label: "Psalm", citation: "Psalm 63:2-8" },
      { label: "Second Reading", citation: "1 Thessalonians 4:13-18" },
      { label: "Gospel", citation: "Matthew 25:1-13" },
    ],
  },
  "2026-11-09": {
    celebration: "Feast of the Dedication of the Lateran Basilica",
    color: "white",
    summary:
      "We celebrate the Pope's cathedral, mother of all churches. Water flows from the temple bringing life, and Jesus speaks of the temple of his body; we too are God's temple.",
    readings: [
      { label: "First Reading", citation: "Ezekiel 47:1-2, 8-9, 12" },
      { label: "Psalm", citation: "Psalm 46:2-3, 5-6, 8-9" },
      { label: "Second Reading", citation: "1 Corinthians 3:9c-11, 16-17" },
      { label: "Gospel", citation: "John 2:13-22" },
    ],
  },
};
