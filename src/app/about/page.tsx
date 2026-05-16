import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-light tracking-[0.2em] text-white mb-2">关于我</h1>
            <p className="text-sm tracking-widest text-white/40">ABOUT</p>
          </div>

          <div className="space-y-8 text-white/60 leading-relaxed">
            <p className="text-lg text-white/80">
              摄影于我，是捕捉光影、定格时间的艺术。
            </p>
            <p>
              每一张照片背后，都有一个独一无二的瞬间。无论是山川湖海的壮阔，还是街角巷尾的温情，
              我都试图通过镜头去发现那些被忽略的美——那些在光影交错中悄然流淌的故事。
            </p>
            <p>
              这里展示的作品，记录了我眼中的世界。希望它们能带给你片刻的宁静，或者一丝共鸣。
            </p>

            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1">39+</div>
                <div className="text-xs tracking-wider text-white/30">作品数量</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1">6+</div>
                <div className="text-xs tracking-wider text-white/30">拍摄城市</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1">∞</div>
                <div className="text-xs tracking-wider text-white/30">创作热情</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
