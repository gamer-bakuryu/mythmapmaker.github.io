export default function InspectorPanel(){

  return (
    <div className="w-80 bg-[#10131a] border-l border-cyan-500/20 p-4 overflow-auto">

      <h2 className="text-xl font-bold mb-4">
        Inspector
      </h2>

      <div className="space-y-4">

        <section>
          <h3 className="font-semibold mb-2">Transform</h3>

          <div className="grid grid-cols-3 gap-2">
            <input className="bg-black/30 p-2 rounded" placeholder="X" />
            <input className="bg-black/30 p-2 rounded" placeholder="Y" />
            <input className="bg-black/30 p-2 rounded" placeholder="Z" />
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Material</h3>

          <input type="range" className="w-full" />
        </section>

      </div>

    </div>
  )
}
