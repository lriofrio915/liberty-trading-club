import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IPortfolio extends Document {
  name: string;
  slug: string;
  tickers: string[];
}

const PortfolioSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "El slug es obligatorio."],
      unique: true,
      index: true,
    },
    tickers: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Portfolio: Model<IPortfolio> =
  models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;
