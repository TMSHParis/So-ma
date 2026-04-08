"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, CheckCircle, Type, AlignLeft, Image } from "lucide-react";
import { SECTION_LABELS } from "@/lib/site-content-config";

type ContentItem = {
  id: string;
  section: string;
  key: string;
  value: string;
  type: "text" | "textarea" | "image";
  label: string;
  position: number;
};

export default function AdminContenuPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [modified, setModified] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/site-content");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        if (!activeSection && data.length > 0) {
          setActiveSection(data[0].section);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleChange = (section: string, key: string, value: string) => {
    const id = `${section}::${key}`;
    setModified((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const getValue = (item: ContentItem) => {
    const id = `${item.section}::${item.key}`;
    return id in modified ? modified[id] : item.value;
  };

  const hasChanges = Object.keys(modified).length > 0;

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const changedItems = Object.entries(modified).map(([id, value]) => {
        const [section, key] = id.split("::");
        return { section, key, value };
      });

      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: changedItems }),
      });

      if (res.ok) {
        setModified({});
        setSaved(true);
        fetchContent();
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  // Grouper par section
  const sections = items.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, ContentItem[]>
  );

  const sectionKeys = Object.keys(sections);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Contenu du site
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modifie les textes et images affichés sur ton site
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Sauvegarde..." : saved ? "Sauvegardé" : "Sauvegarder"}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar des sections */}
        <nav className="hidden md:block w-48 flex-shrink-0">
          <div className="sticky top-4 space-y-1">
            {sectionKeys.map((section) => {
              const count = Object.keys(modified).filter((id) =>
                id.startsWith(`${section}::`)
              ).length;
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {SECTION_LABELS[section] ?? section}
                  {count > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[11px] font-medium bg-primary text-white rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Select mobile */}
        <div className="md:hidden w-full mb-4">
          <select
            value={activeSection ?? ""}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full rounded-lg border border-warm-border bg-white px-3 py-2 text-sm"
          >
            {sectionKeys.map((section) => (
              <option key={section} value={section}>
                {SECTION_LABELS[section] ?? section}
              </option>
            ))}
          </select>
        </div>

        {/* Zone d'édition */}
        <div className="flex-1 min-w-0">
          {activeSection && sections[activeSection] && (
            <div className="bg-white rounded-2xl border border-warm-border p-6">
              <h2 className="text-lg font-semibold mb-6">
                {SECTION_LABELS[activeSection] ?? activeSection}
              </h2>
              <div className="space-y-5">
                {sections[activeSection]
                  .sort((a, b) => a.position - b.position)
                  .map((item) => {
                    const isModified =
                      `${item.section}::${item.key}` in modified;
                    return (
                      <div key={`${item.section}-${item.key}`}>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                          {item.type === "textarea" ? (
                            <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : item.type === "image" ? (
                            <Image className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <Type className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          {item.label}
                          {isModified && (
                            <span className="text-[11px] text-primary font-normal bg-primary/10 px-1.5 py-0.5 rounded">
                              modifié
                            </span>
                          )}
                        </label>
                        {item.type === "textarea" ? (
                          <Textarea
                            value={getValue(item)}
                            onChange={(e) =>
                              handleChange(
                                item.section,
                                item.key,
                                e.target.value
                              )
                            }
                            rows={4}
                            className="resize-y"
                          />
                        ) : item.type === "image" ? (
                          <div className="space-y-2">
                            <Input
                              value={getValue(item)}
                              onChange={(e) =>
                                handleChange(
                                  item.section,
                                  item.key,
                                  e.target.value
                                )
                              }
                              placeholder="URL de l'image"
                            />
                            {getValue(item) && (
                              <img
                                src={getValue(item)}
                                alt="Aperçu"
                                className="h-24 rounded-lg border border-warm-border object-cover"
                              />
                            )}
                          </div>
                        ) : (
                          <Input
                            value={getValue(item)}
                            onChange={(e) =>
                              handleChange(
                                item.section,
                                item.key,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
