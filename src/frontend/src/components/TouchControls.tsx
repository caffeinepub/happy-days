import { useTouchDevice } from "../hooks/useTouchDevice";

interface TouchControlsProps {
  layout: "single" | "twoPlayer";
}

const fireKey = (key: string, type: "keydown" | "keyup") => {
  window.dispatchEvent(
    new KeyboardEvent(type, { key, bubbles: true, cancelable: true }),
  );
};

interface DPadProps {
  keys: {
    up: string;
    down: string;
    left: string;
    right: string;
    action: string;
  };
  label: string;
  colorClass: string;
  actionLabel: string;
}

function DPad({ keys, label, colorClass, actionLabel }: DPadProps) {
  const btn = (key: string, display: string, extraClass = "") => (
    <button
      type="button"
      className={`flex items-center justify-center rounded-2xl font-bold text-white text-2xl select-none active:scale-90 transition-transform ${colorClass} ${extraClass}`}
      style={{ minWidth: 56, minHeight: 56, touchAction: "none" }}
      onTouchStart={(e) => {
        e.preventDefault();
        fireKey(key, "keydown");
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        fireKey(key, "keyup");
      }}
      onMouseDown={() => fireKey(key, "keydown")}
      onMouseUp={() => fireKey(key, "keyup")}
    >
      {display}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs font-bold text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-col items-center gap-1">
        {btn(keys.up, "↑")}
        <div className="flex gap-1">
          {btn(keys.left, "←")}
          {btn(keys.down, "↓")}
          {btn(keys.right, "→")}
        </div>
      </div>
      <button
        type="button"
        className={`mt-2 px-6 py-3 rounded-2xl font-bold text-white text-lg select-none active:scale-90 transition-transform ${colorClass}`}
        style={{ minWidth: 120, touchAction: "none" }}
        onTouchStart={(e) => {
          e.preventDefault();
          fireKey(keys.action, "keydown");
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          fireKey(keys.action, "keyup");
        }}
        onMouseDown={() => fireKey(keys.action, "keydown")}
        onMouseUp={() => fireKey(keys.action, "keyup")}
      >
        {actionLabel}
      </button>
    </div>
  );
}

export function TouchControls({ layout }: TouchControlsProps) {
  const isTouch = useTouchDevice();
  if (!isTouch) return null;

  if (layout === "single") {
    return (
      <div className="flex justify-center mt-4 pb-4">
        <DPad
          keys={{
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
            action: " ",
          }}
          label="Controls"
          colorClass="bg-primary"
          actionLabel="Jump / Action"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-around mt-4 pb-4 gap-4">
      <DPad
        keys={{ up: "w", down: "s", left: "a", right: "d", action: " " }}
        label="Player 1"
        colorClass="bg-blue-500"
        actionLabel="P1 Action"
      />
      <DPad
        keys={{
          up: "ArrowUp",
          down: "ArrowDown",
          left: "ArrowLeft",
          right: "ArrowRight",
          action: "Enter",
        }}
        label="Player 2"
        colorClass="bg-rose-500"
        actionLabel="P2 Action"
      />
    </div>
  );
}
