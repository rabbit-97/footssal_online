import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

router.post("/player", async (req, res) => {
  const { name, speed, goalDecisiveness, shootPower, defense, stamina, tier } =
    req.body;

  try {
    // 선수 추가
    const newPlayer = await prisma.players.create({
      data: {
        name,
        speed,
        goalDecisiveness,
        shootPower,
        defense,
        stamina,
        tier,
      },
    });

    // 성공적으로 추가된 경우 응답
    res.json({
      message: "선수가 추가되었습니다.",
      player: newPlayer, // 추가된 선수 정보
    });
  } catch (err) {
    res.status(500).json({
      message: "오류가 발생했습니다.",
      error: err.message, // 오류 메시지
    });
  }
});

router.get("/player/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 선수 조회
    const player = await prisma.players.findUnique({
      where: { playerId: parseInt(id) },
    });

    if (!player) {
      return res.status(404).json({
        message: "선수를 찾을 수 없습니다.",
      });
    }

    // 선수가 있는 경우 선수 정보 반환
    res.json({
      player: player,
    });
  } catch (err) {
    // 에러 발생 시 응답
    res.status(500).json({
      message: "오류가 발생했습니다.",
      error: err.message, // 오류 메시지 반환
    });
  }
});

router.put("/player/:id", async (req, res) => {
  const { id } = req.params;
  const { name, speed, goalDecisiveness, shootPower, defense, stamina, tier } =
    req.body;

  try {
    // 먼저 해당 선수가 존재하는지 확인
    const existingPlayer = await prisma.players.findUnique({
      where: { playerId: parseInt(id) },
    });

    if (!existingPlayer) {
      return res.status(404).json({
        message: "수정할 선수를 찾을 수 없습니다.",
      });
    }

    // 선수 수정
    const updatedPlayer = await prisma.players.update({
      where: { playerId: parseInt(id) },
      data: {
        name,
        speed,
        goalDecisiveness,
        shootPower,
        defense,
        stamina,
        tier,
      },
    });

    res.json({
      message: "선수 정보가 수정되었습니다.",
      player: updatedPlayer, // 수정된 선수 정보 반환
    });
  } catch (err) {
    res.status(500).json({
      message: "데이터베이스 오류가 발생했습니다.",
      error: err.message,
    });
  }
});

router.delete("/player/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 선수 삭제
    const deletedPlayer = await prisma.players.delete({
      where: { playerId: parseInt(id) },
    });

    res.json({
      message: "선수가 삭제되었습니다.",
      player: deletedPlayer, // 삭제된 선수 정보 반환
    });
  } catch (err) {
    res.status(500).json({
      message: "데이터베이스 오류가 발생했습니다.",
      error: err.message,
    });
  }
});

export default router;
